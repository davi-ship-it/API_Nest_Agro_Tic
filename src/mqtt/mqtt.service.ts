import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttConfigService } from '../mqtt_config/mqtt_config.service';
import { MedicionSensorService } from '../medicion_sensor/medicion_sensor.service';
import { MqttGateway } from './mqtt.gateway';

interface MqttConnection {
  client: mqtt.MqttClient;
  configId: string;
  zonaMqttConfigId: string;
  zonaId: string;
  topic: string;
  connected: boolean;
}

@Injectable()
export class MqttService implements OnModuleInit {
  private connections = new Map<string, MqttConnection>(); // configId -> connection
  private logger = new Logger(MqttService.name);

  constructor(
    private readonly mqttConfigService: MqttConfigService,
    private readonly medicionSensorService: MedicionSensorService,
    private readonly mqttGateway: MqttGateway,
  ) {}

  async onModuleInit() {
    await this.initializeConnections();
  }

  private async initializeConnections() {
    try {
      const activeZonaMqttConfigs = await this.mqttConfigService.findActiveZonaMqttConfigs();
      this.logger.log(`Inicializando ${activeZonaMqttConfigs.length} conexiones MQTT activas`);

      for (const zonaMqttConfig of activeZonaMqttConfigs) {
        await this.createConnection(zonaMqttConfig);
      }
    } catch (error) {
      this.logger.error('Error inicializando conexiones MQTT:', error);
    }
  }

  private async createConnection(zonaMqttConfig: any) {
    try {
      const config = zonaMqttConfig.mqttConfig;
      const zona = zonaMqttConfig.zona;

      // Validar que el tópico no esté siendo usado por otra zona activa
      const isTopicUnique = await this.validateUniqueTopic(config.topicBase, zona.id);
      if (!isTopicUnique) {
        this.logger.error(`Tópico ${config.topicBase} ya está siendo usado por otra zona activa`);
        this.emitConnectionStatus(zona.id, false, 'Error: Tópico MQTT ya en uso por otra zona');
        return;
      }

      const brokerUrl = this.buildBrokerUrl(config);
      this.logger.log(`Conectando a ${brokerUrl} para zona ${zona.id}`);

      const client = mqtt.connect(brokerUrl);

      const connection: MqttConnection = {
        client,
        configId: config.id,
        zonaMqttConfigId: zonaMqttConfig.id,
        zonaId: zona.id,
        topic: config.topicBase,
        connected: false,
      };

      this.connections.set(config.id, connection);

      // Emitir estado inicial de conexión
      this.emitConnectionStatus(zona.id, false, 'Conectando al broker...');

      client.on('connect', () => {
        this.logger.log(`Conectado a MQTT para zona ${zona.id}`);
        connection.connected = true;
        this.emitConnectionStatus(zona.id, true, 'Conexión exitosa al broker');

        // Suscribirse al tópico
        client.subscribe(config.topicBase, (err) => {
          if (err) {
            this.logger.error(`Error suscribiéndose a ${config.topicBase}:`, err);
            this.emitConnectionStatus(zona.id, false, `Error al suscribirse: ${err.message}`);
          } else {
            this.logger.log(`Suscrito a tópico ${config.topicBase} para zona ${zona.id}`);
            this.emitConnectionStatus(zona.id, true, 'Suscripción exitosa - listo para recibir datos');
          }
        });
      });

      client.on('disconnect', () => {
        this.logger.warn(`Desconectado MQTT para zona ${zona.id}`);
        connection.connected = false;
        this.emitConnectionStatus(zona.id, false, 'Desconectado del broker MQTT');
      });

      client.on('error', (error) => {
        this.logger.error(`Error MQTT para zona ${zona.id}:`, error);
        connection.connected = false;
        this.emitConnectionStatus(zona.id, false, `Error de conexión: ${error.message}`);
      });

      client.on('message', async (topic, message) => {
        await this.handleIncomingMessage(topic, message, zonaMqttConfig);
      });

      client.on('offline', () => {
        this.logger.warn(`Cliente MQTT offline para zona ${zona.id}`);
        connection.connected = false;
        this.emitConnectionStatus(zona.id, false, 'Sin conexión a internet - modo offline');
      });

      client.on('reconnect', () => {
        this.logger.log(`Reintentando conexión MQTT para zona ${zona.id}...`);
        this.emitConnectionStatus(zona.id, false, 'Reintentando conexión...');
      });

    } catch (error) {
      this.logger.error(`Error creando conexión para zona ${zonaMqttConfig.zona.id}:`, error);
      this.emitConnectionStatus(zonaMqttConfig.zona.id, false, `Error de configuración: ${error.message}`);
    }
  }

  private buildBrokerUrl(config: any): string {
    const protocol = config.protocol === 'wss' ? 'wss' : config.protocol === 'ws' ? 'ws' : 'mqtt';
    const port = config.port || (protocol === 'wss' ? 8884 : protocol === 'ws' ? 8883 : 1883);
    return `${protocol}://${config.host}:${port}`;
  }

  // Método para agregar nueva conexión cuando se asigna una config a zona
  async addConnection(zonaMqttConfig: any) {
    await this.createConnection(zonaMqttConfig);
  }

  // Método para remover conexión cuando se desactiva una asignación zona-config
  async removeConnection(zonaMqttConfigId: string) {
    // Find connection by zonaMqttConfigId
    for (const [configId, connection] of this.connections) {
      if (connection.zonaMqttConfigId === zonaMqttConfigId) {
        connection.client.end();
        this.connections.delete(configId);
        this.logger.log(`Conexión removida para zonaMqttConfig ${zonaMqttConfigId}`);
        this.emitConnectionStatus(connection.zonaId, false, 'Configuración desactivada');
        break;
      }
    }
  }

  // Método para refrescar conexiones (cuando cambian configs)
  async refreshConnections() {
    // Cerrar todas las conexiones existentes
    for (const [configId, connection] of this.connections) {
      connection.client.end();
    }
    this.connections.clear();

    // Recrear conexiones con configs activas
    await this.initializeConnections();
  }

  private async handleIncomingMessage(topic: string, message: Buffer, zonaMqttConfig: any) {
    try {
      const payload = JSON.parse(message.toString());
      this.logger.log(`Mensaje recibido en ${topic} para zona ${zonaMqttConfig.zona.id}:`, payload);

      await this.saveSensorData(zonaMqttConfig.id, zonaMqttConfig.zona.id, payload);

    } catch (error) {
      this.logger.error('Error procesando mensaje MQTT:', error);
    }
  }

  private async saveSensorData(zonaMqttConfigId: string, zonaId: string, payload: any) {
    try {
      const mediciones: any[] = [];

      // Convertir cada key del payload en una medición
      Object.entries(payload).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          // Extraer valor numérico y unidad si es posible
          const parsed = this.parseValueWithUnit(String(value));

          mediciones.push({
            key,
            valor: parsed.n,
            fechaMedicion: new Date(),
            fkZonaMqttConfigId: zonaMqttConfigId,
          });
        }
      });

      if (mediciones.length > 0) {
        const saved = await this.medicionSensorService.saveBatch(mediciones);
        this.logger.log(`Guardadas ${saved.length} mediciones`);

        // Emitir a WebSocket
        this.mqttGateway.emitNuevaLectura({
          zonaId,
          mediciones: saved,
          timestamp: new Date(),
        });
      }

    } catch (error) {
      this.logger.error('Error guardando datos del sensor:', error);
    }
  }

  private parseValueWithUnit(raw: string) {
    const s = String(raw).trim();
    const m = s.match(/^(-?\d+(?:\.\d+)?)(?:\s*)(.*)$/);
    if (m) {
      return { n: parseFloat(m[1]), unit: (m[2] || "").trim() };
    }
    return { n: NaN, unit: "" };
  }

  private async validateUniqueTopic(topicBase: string, zonaId: string): Promise<boolean> {
    // Verificar si alguna conexión activa usa el mismo tópico para otra zona
    for (const connection of this.connections.values()) {
      if (connection.zonaId !== zonaId && connection.topic === topicBase && connection.connected) {
        return false;
      }
    }
    return true;
  }

  private emitConnectionStatus(zonaId: string, conectado: boolean, mensaje: string) {
    this.mqttGateway.emitEstadoConexion({ zonaId, conectado, mensaje });
  }

  // Método público para verificar estado de una zona específica
  getConnectionStatus(zonaId: string): boolean {
    for (const connection of this.connections.values()) {
      if (connection.zonaId === zonaId) {
        return connection.connected;
      }
    }
    return false;
  }

}