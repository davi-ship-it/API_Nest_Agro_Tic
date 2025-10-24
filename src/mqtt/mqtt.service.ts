import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttConfigService } from '../mqtt_config/mqtt_config.service';
import { MedicionSensorService } from '../medicion_sensor/medicion_sensor.service';
import { MqttGateway } from './mqtt.gateway';

@Injectable()
export class MqttService implements OnModuleInit {
  private client: mqtt.MqttClient | null = null;
  private logger = new Logger(MqttService.name);
  private subscribedTopics = new Set<string>();
  private connectionStatus = false;

  constructor(
    private readonly mqttConfigService: MqttConfigService,
    private readonly medicionSensorService: MedicionSensorService,
    private readonly mqttGateway: MqttGateway,
  ) {}

  async onModuleInit() {
    await this.initializeMqttConnection();
  }

  private async initializeMqttConnection() {
    try {
      // Conectar al broker público (test.mosquitto.org)
      this.client = mqtt.connect('mqtt://test.mosquitto.org:1883');

      this.client.on('connect', async () => {
        this.logger.log('Conectado al broker MQTT público');
        this.connectionStatus = true;
        await this.subscribeToActiveConfigs();
      });

      this.client.on('disconnect', () => {
        this.logger.warn('Desconectado del broker MQTT');
        this.connectionStatus = false;
        this.emitConnectionStatus(false, 'Desconectado del broker');
      });

      this.client.on('error', (error) => {
        this.logger.error('Error en conexión MQTT:', error);
        this.connectionStatus = false;
        this.emitConnectionStatus(false, `Error: ${error.message}`);
      });

      this.client.on('message', async (topic, message) => {
        await this.handleIncomingMessage(topic, message);
      });

      this.client.on('offline', () => {
        this.logger.warn('Cliente MQTT offline');
        this.connectionStatus = false;
        this.emitConnectionStatus(false, 'Offline');
      });

      this.client.on('reconnect', () => {
        this.logger.log('Reintentando conexión MQTT...');
      });

    } catch (error) {
      this.logger.error('Error inicializando MQTT:', error);
    }
  }

  private async subscribeToActiveConfigs() {
    if (!this.client || !this.connectionStatus) return;

    try {
      const activeConfigs = await this.mqttConfigService.findActive();

      // Suscribirse al tópico base para todas las configs activas
      const baseTopic = 'datos/agrotic';
      if (!this.subscribedTopics.has(baseTopic)) {
        this.client.subscribe(baseTopic, (err) => {
          if (!err) {
            this.logger.log(`Suscrito al tópico: ${baseTopic}`);
            this.subscribedTopics.add(baseTopic);
          } else {
            this.logger.error(`Error suscribiéndose a ${baseTopic}:`, err);
          }
        });
      }

      // Emitir estado de conexión para cada zona con config activa
      activeConfigs.forEach(config => {
        this.emitConnectionStatus(true, 'Conectado', config.fkZonaId);
      });

    } catch (error) {
      this.logger.error('Error suscribiéndose a configs activas:', error);
    }
  }

  private async handleIncomingMessage(topic: string, message: Buffer) {
    try {
      const payload = JSON.parse(message.toString());
      this.logger.log(`Mensaje recibido en ${topic}:`, payload);

      // Buscar configs activas para determinar zona
      const activeConfigs = await this.mqttConfigService.findActive();

      // Por ahora, asignar a la primera config activa (puedes mejorar lógica después)
      if (activeConfigs.length > 0) {
        const config = activeConfigs[0];
        await this.saveSensorData(config.id, config.fkZonaId, payload);
      }

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

  private emitConnectionStatus(conectado: boolean, mensaje: string, zonaId?: string) {
    if (zonaId) {
      this.mqttGateway.emitEstadoConexion({ zonaId, conectado, mensaje });
    }
  }

  // Método público para verificar estado
  getConnectionStatus(): boolean {
    return this.connectionStatus;
  }

  // Método para refrescar suscripciones (llamar cuando se actualicen configs)
  async refreshSubscriptions() {
    if (this.client && this.connectionStatus) {
      await this.subscribeToActiveConfigs();
    }
  }
}