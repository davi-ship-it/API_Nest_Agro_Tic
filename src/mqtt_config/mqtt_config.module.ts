import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttConfigService } from './mqtt_config.service';
import { MqttConfigController } from './mqtt_config.controller';
import { MqttConfig } from './entities/mqtt_config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MqttConfig])],
  controllers: [MqttConfigController],
  providers: [MqttConfigService],
  exports: [MqttConfigService],
})
export class MqttConfigModule {}