import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttGateway } from './mqtt.gateway';
import { MqttController } from './mqtt.controller';
import { MqttConfigModule } from '../mqtt_config/mqtt_config.module';
import { MedicionSensorModule } from '../medicion_sensor/medicion_sensor.module';

@Module({
  imports: [MqttConfigModule, MedicionSensorModule],
  controllers: [MqttController],
  providers: [MqttService, MqttGateway],
  exports: [MqttService, MqttGateway],
})
export class MqttModule {}