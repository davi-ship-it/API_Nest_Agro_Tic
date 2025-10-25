import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MqttConfigService } from './mqtt_config.service';
import { CreateMqttConfigDto } from './dto/create-mqtt_config.dto';
import { UpdateMqttConfigDto } from './dto/update-mqtt_config.dto';
import { MqttService } from '../mqtt/mqtt.service';

@Controller('mqtt-config')
export class MqttConfigController {
  constructor(
    private readonly mqttConfigService: MqttConfigService,
    private readonly mqttService: MqttService,
  ) {}

  @Post()
  async create(@Body() createMqttConfigDto: CreateMqttConfigDto) {
    const config = await this.mqttConfigService.create(createMqttConfigDto);

    // Si la configuración está activa, crear conexión MQTT
    if (config.activa) {
      await this.mqttService.addConnection(config);
    }

    return config;
  }

  @Get()
  findAll() {
    return this.mqttConfigService.findAll();
  }

  @Get('active')
  findActive() {
    return this.mqttConfigService.findActive();
  }

  @Get('zona/:zonaId')
  findByZona(@Param('zonaId') zonaId: string) {
    return this.mqttConfigService.findByZona(zonaId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mqttConfigService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMqttConfigDto: UpdateMqttConfigDto,
  ) {
    const oldConfig = await this.mqttConfigService.findOne(id);
    const updatedConfig = await this.mqttConfigService.update(id, updateMqttConfigDto);

    // Gestionar conexiones MQTT basadas en cambios de estado
    if (oldConfig?.activa && !updatedConfig.activa) {
      // Se desactivó la configuración
      await this.mqttService.removeConnection(id);
    } else if (!oldConfig?.activa && updatedConfig.activa) {
      // Se activó la configuración
      await this.mqttService.addConnection(updatedConfig);
    } else if (updatedConfig.activa) {
      // Se actualizó una configuración activa - refrescar conexión
      await this.mqttService.removeConnection(id);
      await this.mqttService.addConnection(updatedConfig);
    }

    return updatedConfig;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    // Remover conexión MQTT antes de eliminar la configuración
    await this.mqttService.removeConnection(id);
    return this.mqttConfigService.remove(id);
  }

  @Post('test-connection')
  async testConnection(@Body() testData: { host: string; port: string; protocol: string; topicBase: string }) {
    try {
      const startTime = Date.now();

      // Crear una conexión temporal para probar
      const brokerUrl = this.buildTestBrokerUrl(testData);
      const client = require('mqtt').connect(brokerUrl);

      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          client.end();
          resolve({
            success: false,
            message: 'Timeout: No se pudo conectar al broker en 10 segundos',
            latency: null,
          });
        }, 10000);

        client.on('connect', () => {
          const latency = Date.now() - startTime;
          clearTimeout(timeout);

          // Suscribirse al tópico para verificar permisos
          client.subscribe(testData.topicBase, (err: any) => {
            client.end();

            if (err) {
              resolve({
                success: false,
                message: `Conexión exitosa pero error al suscribirse: ${err.message}`,
                latency,
              });
            } else {
              resolve({
                success: true,
                message: 'Conexión y suscripción exitosas',
                latency,
              });
            }
          });
        });

        client.on('error', (error: any) => {
          clearTimeout(timeout);
          client.end();
          resolve({
            success: false,
            message: `Error de conexión: ${error.message}`,
            latency: null,
          });
        });
      });
    } catch (error: any) {
      return {
        success: false,
        message: `Error interno: ${error.message}`,
        latency: null,
      };
    }
  }

  private buildTestBrokerUrl(testData: { host: string; port: string; protocol: string }): string {
    const protocol = testData.protocol === 'wss' ? 'wss' : testData.protocol === 'ws' ? 'ws' : 'mqtt';
    const port = testData.port || (protocol === 'wss' ? '8884' : protocol === 'ws' ? '8883' : '1883');
    return `${protocol}://${testData.host}:${port}`;
  }
}