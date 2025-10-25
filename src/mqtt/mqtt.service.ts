import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttConfigService } from '../mqtt_config/mqtt_config.service';
import { MedicionSensorService } from '../medicion_sensor/medicion_sensor.service';
import { MqttGateway } from './mqtt.gateway';

interface MqttConnection {
  client: mqtt.MqttClient;
  configId: string;
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
      const activeConfigs = await this.mqttConfigService.findActive();
      this.logger.log(`Inicializando ${activeConfigs.length} conexiones MQTT activas`);

      for (const config of activeConfigs) {
        await this.createConnection(config);
      }
    } catch (error) {
      this.logger.error('Error inicializando conexiones MQTT:', error);
    }
  }

  private async createConnection(config: any) {
    try {
      const brokerUrl = this.buildBrokerUrl(config);
      this.logger.log(`Conectando a ${brokerUrl} para zona ${config.fkZonaId}`);

      const client = mqtt.connect(brokerUrl);

      const connection: MqttConnection = {
        client,
        configId: config.id,
        zonaId: config.fkZonaId,
        topic: config.topicBase,
        connected: false,
      };

      this.connections.set(config.id, connection);

      client.on('connect', () => {
        this.logger.log(`Conectado a MQTT para zona ${config.fkZonaId}`);
        connection.connected = true;
        this.emitConnectionStatus(config.fkZonaId, true, 'Conectado exitosamente');

        // Suscribirse al tópico
        client.subscribe(config.topicBase, (err) => {
          if (err) {
            this.logger.error(`Error suscribiéndose a ${config.topicBase}:`, err);
          } else {
            this.logger.log(`Suscrito a tópico ${config.topicBase} para zona ${config.fkZonaId}`);
          }
        });
      });

      client.on('disconnect', () => {
        this.logger.warn(`Desconectado MQTT para zona ${config.fkZonaId}`);
        connection.connected = false;
        this.emitConnectionStatus(config.fkZonaId, false, 'Desconectado del broker');
      });

      client.on('error', (error) => {
        this.logger.error(`Error MQTT para zona ${config.fkZonaId}:`, error);
        connection.connected = false;
        this.emitConnectionStatus(config.fkZonaId, false, `Error: ${error.message}`);
      });

      client.on('message', async (topic, message) => {
        await this.handleIncomingMessage(topic, message, config);
      });

      client.on('offline', () => {
        this.logger.warn(`Cliente MQTT offline para zona ${config.fkZonaId}`);
        connection.connected = false;
        this.emitConnectionStatus(config.fkZonaId, false, 'Offline');
      });

      client.on('reconnect', () => {
        this.logger.log(`Reintentando conexión MQTT para zona ${config.fkZonaId}...`);
      });

    } catch (error) {
      this.logger.error(`Error creando conexión para zona ${config.fkZonaId}:`, error);
      this.emitConnectionStatus(config.fkZonaId, false, `Error de configuración: ${error.message}`);
    }
  }

  private buildBrokerUrl(config: any): string {
    const protocol = config.protocol === 'wss' ? 'wss' : config.protocol === 'ws' ? 'ws' : 'mqtt';
    const port = config.port || (protocol === 'wss' ? 8884 : protocol === 'ws' ? 8883 : 1883);
    return `${protocol}://${config.host}:${port}`;
  }

  // Método para agregar nueva conexión cuando se crea una config
  async addConnection(config: any) {
    await this.createConnection(config);
  }

  // Método para remover conexión cuando se desactiva una config
  async removeConnection(configId: string) {
    const connection = this.connections.get(configId);
    if (connection) {
      connection.client.end();
      this.connections.delete(configId);
      this.logger.log(`Conexión removida para config ${configId}`);
      this.emitConnectionStatus(connection.zonaId, false, 'Configuración desactivada');
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

  private async handleIncomingMessage(topic: string, message: Buffer, config: any) {
    try {
      const payload = JSON.parse(message.toString());
      this.logger.log(`Mensaje recibido en ${topic} para zona ${config.fkZonaId}:`, payload);

      await this.saveSensorData(config.id, config.fkZonaId, payload);

    } catch (error) {
      this.logger.error('Error procesando mensaje MQTT:', error);
    }
  }

  private async saveSensorData(mqttConfigId: string, zonaId: string, payload: any) {
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
            unidad: parsed.unit,
            fechaMedicion: new Date(),
            fkMqttConfigId: mqttConfigId,
            fkZonaId: zonaId,
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