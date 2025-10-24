import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttConfigService } from '../mqtt_config/mqtt_config.service';
import { MedicionSensorService } from '../medicion_sensor/medicion_sensor.service';
import { MqttGateway } from './mqtt.gateway';
import { MqttConfig } from '../mqtt_config/entities/mqtt_config.entity';

@Injectable()
export class MqttService implements OnModuleInit {
  private activeConnections = new Map<string, mqtt.MqttClient>();
  private retryCounts = new Map<string, number>();
  private lastMessageTimes = new Map<string, Date>();
  private noDataCheckInterval: NodeJS.Timeout | null = null;
  private logger = new Logger(MqttService.name);
  private maxRetries = 3;
  private retryDelay = 5000; // 5 seconds
  private noDataTimeout = 15000; // 15 seconds without data

  constructor(
    private readonly mqttConfigService: MqttConfigService,
    private readonly medicionSensorService: MedicionSensorService,
    private readonly mqttGateway: MqttGateway,
  ) {}

  async onModuleInit() {
    // No longer auto-connect; wait for explicit connection requests
    this.startNoDataCheck();
  }

  private startNoDataCheck() {
    this.noDataCheckInterval = setInterval(() => {
      this.checkForNoData();
    }, 5000); // Check every 5 seconds
  }

  private async checkForNoData() {
    const now = new Date();
    for (const [zonaId, lastMessageTime] of this.lastMessageTimes) {
      const timeDiff = now.getTime() - lastMessageTime.getTime();
      if (timeDiff > this.noDataTimeout && this.activeConnections.has(zonaId)) {
        this.logger.warn(`No se han recibido datos de zona ${zonaId} en los últimos ${this.noDataTimeout / 1000} segundos`);
        this.emitConnectionStatus(false, 'Sin recepción de datos', zonaId);
      }
    }
  }

  async connectToBroker(config: MqttConfig): Promise<boolean> {
    const zonaId = config.fkZonaId;
    console.log(`🔗 MqttService: Attempting connection for zone ${zonaId}`);
    console.log(`📋 MqttService: Config details:`, {
      host: config.host,
      port: config.port,
      protocol: config.protocol,
      topicBase: config.topicBase,
      activa: config.activa
    });

    if (this.activeConnections.has(zonaId)) {
      this.logger.warn(`⚠️ MqttService: Active connection already exists for zone ${zonaId}`);
      return true;
    }

    try {
      const brokerUrl = `${config.protocol}://${config.host}:${config.port}`;
      this.logger.log(`🌐 MqttService: Connecting to ${brokerUrl} for zone ${zonaId}`);
      console.log(`🔗 MqttService: Full broker URL: ${brokerUrl}`);

      const client = mqtt.connect(brokerUrl);
      console.log(`📡 MqttService: MQTT client created for zone ${zonaId}`);

      client.on('connect', async () => {
        this.logger.log(`✅ MqttService: Connected to MQTT broker for zone ${zonaId}`);
        console.log(`🎉 MqttService: Connection established successfully`);
        this.retryCounts.delete(zonaId);
        this.activeConnections.set(zonaId, client);
        this.lastMessageTimes.set(zonaId, new Date()); // Initialize last message time
        await this.subscribeToTopic(client, config.topicBase, zonaId);
        this.emitConnectionStatus(true, 'Conectado', zonaId);
      });

      client.on('disconnect', () => {
        this.logger.warn(`❌ MqttService: Disconnected from MQTT broker for zone ${zonaId}`);
        console.log(`🔌 MqttService: Connection lost for zone ${zonaId}`);
        this.handleDisconnection(zonaId, 'Desconectado del broker');
      });

      client.on('error', (error) => {
        this.logger.error(`💥 MqttService: Connection error for zone ${zonaId}:`, error);
        console.error(`❌ MqttService: MQTT error details:`, error);
        this.handleDisconnection(zonaId, `Error: ${error.message}`);
      });

      client.on('message', async (topic, message) => {
        console.log(`📨 MqttService: Message received on topic ${topic} for zone ${zonaId}`);
        console.log(`📄 MqttService: Raw message:`, message.toString());
        await this.handleIncomingMessage(topic, message, zonaId);
      });

      client.on('offline', () => {
        this.logger.warn(`📴 MqttService: MQTT client offline for zone ${zonaId}`);
        console.log(`⚠️ MqttService: Client went offline for zone ${zonaId}`);
        this.handleDisconnection(zonaId, 'Offline');
      });

      client.on('reconnect', () => {
        this.logger.log(`🔄 MqttService: Reconnecting MQTT for zone ${zonaId}...`);
        console.log(`🔄 MqttService: Attempting reconnection for zone ${zonaId}`);
      });

      return true;
    } catch (error) {
      this.logger.error(`💥 MqttService: Error connecting to broker for zone ${zonaId}:`, error);
      console.error(`❌ MqttService: Connection setup failed:`, error);
      return false;
    }
  }

  private async subscribeToTopic(client: mqtt.MqttClient, topic: string, zonaId: string) {
    client.subscribe(topic, (err) => {
      if (!err) {
        this.logger.log(`Suscrito al tópico ${topic} para zona ${zonaId}`);
      } else {
        this.logger.error(`Error suscribiéndose a ${topic} para zona ${zonaId}:`, err);
      }
    });
  }

  private handleDisconnection(zonaId: string, reason: string) {
    const currentRetries = this.retryCounts.get(zonaId) || 0;
    if (currentRetries < this.maxRetries) {
      this.retryCounts.set(zonaId, currentRetries + 1);
      this.logger.log(`Reintento ${currentRetries + 1}/${this.maxRetries} para zona ${zonaId} en ${this.retryDelay}ms`);
      this.emitConnectionStatus(false, `Reintentando conexión (intento ${currentRetries + 1})`, zonaId);
      setTimeout(async () => {
        const config = await this.mqttConfigService.findByZona(zonaId);
        if (config && config.activa) {
          await this.connectToBroker(config);
        }
      }, this.retryDelay);
    } else {
      this.logger.error(`Máximo de reintentos alcanzado para zona ${zonaId}`);
      this.activeConnections.delete(zonaId);
      this.retryCounts.delete(zonaId);
      this.emitConnectionStatus(false, 'Desconectado permanentemente', zonaId);
    }
  }

  async disconnectFromBroker(zonaId: string): Promise<boolean> {
    const client = this.activeConnections.get(zonaId);
    if (client) {
      client.end();
      this.activeConnections.delete(zonaId);
      this.retryCounts.delete(zonaId);
      this.lastMessageTimes.delete(zonaId);
      this.emitConnectionStatus(false, 'Desconectado manualmente', zonaId);
      this.logger.log(`Desconectado del broker para zona ${zonaId}`);
      return true;
    }
    return false;
  }

  private async handleIncomingMessage(topic: string, message: Buffer, zonaId: string) {
    try {
      console.log(`📨 MqttService: Processing incoming message for zone ${zonaId}`);
      console.log(`📍 MqttService: Topic: ${topic}`);
      console.log(`📄 MqttService: Raw message:`, message.toString());

      const payload = JSON.parse(message.toString());
      this.logger.log(`📋 MqttService: Parsed payload for zone ${zonaId}:`, payload);
      console.log(`✅ MqttService: JSON parsed successfully`);

      // Update last message time for this zone
      this.lastMessageTimes.set(zonaId, new Date());
      console.log(`⏰ MqttService: Updated last message time for zone ${zonaId}`);

      // If we were in "no data" state, emit that we're receiving data again
      const connectionStatus = this.getConnectionStatus(zonaId);
      if (!connectionStatus) {
        console.log(`🔄 MqttService: Emitting status change - receiving data again for zone ${zonaId}`);
        this.emitConnectionStatus(true, 'Recibiendo datos nuevamente', zonaId);
      }

      const config = await this.mqttConfigService.findByZona(zonaId);
      if (config) {
        console.log(`⚙️ MqttService: Found active config for zone ${zonaId}, proceeding to save data`);
        await this.saveSensorData(config.id, zonaId, payload);
      } else {
        this.logger.warn(`⚠️ MqttService: No active config found for zone ${zonaId}`);
        console.log(`❌ MqttService: Cannot save sensor data - no config available`);
      }

    } catch (error) {
      this.logger.error('💥 MqttService: Error processing MQTT message:', error);
      console.error(`❌ MqttService: Message processing failed:`, error);
    }
  }

  private async saveSensorData(mqttConfigId: string, zonaId: string, payload: any) {
    try {
      console.log(`💾 MqttService: Starting to save sensor data for zone ${zonaId}`);
      console.log(`📋 MqttService: Payload to process:`, payload);

      const mediciones: any[] = [];

      // Convertir cada key del payload en una medición
      Object.entries(payload).forEach(([key, value]) => {
        console.log(`🔄 MqttService: Processing key: ${key}, value: ${value}, type: ${typeof value}`);
        if (typeof value === 'string' || typeof value === 'number') {
          // Extraer valor numérico y unidad si es posible
          const parsed = this.parseValueWithUnit(String(value));
          console.log(`📊 MqttService: Parsed value for ${key}:`, parsed);

          mediciones.push({
            key,
            valor: parsed.n,
            unidad: parsed.unit,
            fechaMedicion: new Date(),
            fkMqttConfigId: mqttConfigId,
            fkZonaId: zonaId,
          });
        } else {
          console.log(`⚠️ MqttService: Skipping key ${key} - invalid value type`);
        }
      });

      console.log(`📈 MqttService: Prepared ${mediciones.length} measurements for saving`);

      if (mediciones.length > 0) {
        console.log(`💾 MqttService: Saving measurements to database...`);
        const saved = await this.medicionSensorService.saveBatch(mediciones);
        this.logger.log(`✅ MqttService: Saved ${saved.length} measurements`);
        console.log(`✅ MqttService: Measurements saved successfully:`, saved);

        // Emitir a WebSocket
        console.log(`📡 MqttService: Emitting new readings via WebSocket for zone ${zonaId}`);
        this.mqttGateway.emitNuevaLectura({
          zonaId,
          mediciones: saved,
          timestamp: new Date(),
        });
        console.log(`📡 MqttService: WebSocket emission completed`);
      } else {
        console.log(`⚠️ MqttService: No valid measurements to save`);
      }

    } catch (error) {
      this.logger.error('💥 MqttService: Error saving sensor data:', error);
      console.error(`❌ MqttService: Database save failed:`, error);
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

  // Método público para verificar estado de una zona específica
  getConnectionStatus(zonaId?: string): boolean {
    if (zonaId) {
      return this.activeConnections.has(zonaId);
    }
    return this.activeConnections.size > 0;
  }

  // Método para refrescar conexiones (llamar cuando se actualicen configs)
  async refreshConnections() {
    // Disconnect inactive configs
    const activeConfigs = await this.mqttConfigService.findActive();
    const activeZonaIds = new Set(activeConfigs.map(c => c.fkZonaId));

    for (const [zonaId] of this.activeConnections) {
      if (!activeZonaIds.has(zonaId)) {
        await this.disconnectFromBroker(zonaId);
      }
    }

    // Connect new active configs
    for (const config of activeConfigs) {
      if (!this.activeConnections.has(config.fkZonaId)) {
        await this.connectToBroker(config);
      }
    }
  }
}