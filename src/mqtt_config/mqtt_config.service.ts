import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MqttConfig } from './entities/mqtt_config.entity';
import { CreateMqttConfigDto } from './dto/create-mqtt_config.dto';
import { UpdateMqttConfigDto } from './dto/update-mqtt_config.dto';

@Injectable()
export class MqttConfigService {
  constructor(
    @InjectRepository(MqttConfig)
    private readonly mqttConfigRepository: Repository<MqttConfig>,
  ) {}

  async create(createMqttConfigDto: CreateMqttConfigDto): Promise<MqttConfig> {
    const mqttConfig = this.mqttConfigRepository.create({
      ...createMqttConfigDto,
      port: parseInt(createMqttConfigDto.port, 10),
    });
    return await this.mqttConfigRepository.save(mqttConfig);
  }

  async findAll(): Promise<MqttConfig[]> {
    return await this.mqttConfigRepository.find({
      relations: ['zona'],
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: string): Promise<MqttConfig | null> {
    return await this.mqttConfigRepository.findOne({
      where: { id },
      relations: ['zona'],
    });
  }

  async findByZona(zonaId: string): Promise<MqttConfig | null> {
    return await this.mqttConfigRepository.findOne({
      where: { fkZonaId: zonaId },
      relations: ['zona'],
    });
  }

  async findActive(): Promise<MqttConfig[]> {
    return await this.mqttConfigRepository.find({
      where: { activa: true },
      relations: ['zona'],
    });
  }

  async update(id: string, updateMqttConfigDto: UpdateMqttConfigDto): Promise<MqttConfig> {
    const updateData: any = { ...updateMqttConfigDto };
    if (updateMqttConfigDto.port) {
      updateData.port = parseInt(updateMqttConfigDto.port as string, 10);
    }
    await this.mqttConfigRepository.update(id, updateData);
    const result = await this.findOne(id);
    if (!result) throw new Error('Configuración no encontrada');
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.mqttConfigRepository.delete(id);
  }
}