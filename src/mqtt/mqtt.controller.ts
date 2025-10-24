import { Controller, Post, Param, Body } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttConfigService } from '../mqtt_config/mqtt_config.service';

@Controller('mqtt')
export class MqttController {
  constructor(
    private readonly mqttService: MqttService,
    private readonly mqttConfigService: MqttConfigService,
  ) {}

  @Post('connect/:zonaId')
  async connect(@Param('zonaId') zonaId: string) {
    console.log(`🔗 MqttController: Connect request received for zone ${zonaId}`);
    try {
      console.log(`🔍 MqttController: Looking for MQTT config for zone ${zonaId}`);
      const config = await this.mqttConfigService.findByZona(zonaId);
      console.log(`📋 MqttController: Config found:`, config);

      if (!config || !config.activa) {
        console.log(`❌ MqttController: No active MQTT config found for zone ${zonaId}`);
        return {
          success: false,
          message: 'No se encontró configuración MQTT activa para esta zona',
        };
      }

      console.log(`✅ MqttController: Active config found, attempting connection`);
      // Emitir señal de inicio al frontend
      // this.mqttGateway.emitInicioConexion(zonaId, 'Iniciando conexión...');

      const connected = await this.mqttService.connectToBroker(config);
      console.log(`📊 MqttController: Connection result: ${connected}`);
      return {
        success: connected,
        message: connected ? 'Conexión iniciada exitosamente' : 'Error al iniciar conexión',
      };
    } catch (error) {
      console.error(`💥 MqttController: Error during connection:`, error);
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    }
  }

  @Post('disconnect/:zonaId')
  async disconnect(@Param('zonaId') zonaId: string) {
    try {
      const disconnected = await this.mqttService.disconnectFromBroker(zonaId);
      return {
        success: disconnected,
        message: disconnected ? 'Desconexión exitosa' : 'No había conexión activa',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    }
  }

  @Post('refresh')
  async refresh() {
    try {
      await this.mqttService.refreshConnections();
      return {
        success: true,
        message: 'Conexiones refrescadas exitosamente',
      };
    } catch (error) {
      return {
        success: false,
        message: `Error: ${error.message}`,
      };
    }
  }
}