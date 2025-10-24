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

@Controller('mqtt-config')
export class MqttConfigController {
  constructor(private readonly mqttConfigService: MqttConfigService) {}

  @Post()
  create(@Body() createMqttConfigDto: CreateMqttConfigDto) {
    return this.mqttConfigService.create(createMqttConfigDto);
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
  update(
    @Param('id') id: string,
    @Body() updateMqttConfigDto: UpdateMqttConfigDto,
  ) {
    return this.mqttConfigService.update(id, updateMqttConfigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mqttConfigService.remove(id);
  }
}