import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Variedad } from './entities/variedad.entity';
import { CreateVariedadDto } from './dto/create-variedad.dto';
import { UpdateVariedadDto } from './dto/update-variedad.dto';

@Injectable()
export class VariedadesService {
  constructor(
    @InjectRepository(Variedad)
    private readonly variedadRepo: Repository<Variedad>,
  ) {}

  async create(dto: CreateVariedadDto): Promise<Variedad> {
    const variedad = this.variedadRepo.create(dto);
    return await this.variedadRepo.save(variedad);
  }

  async findAll(): Promise<Variedad[]> {
    return await this.variedadRepo.find();
  }

  async findOne(id: string): Promise<Variedad> {
    const variedad = await this.variedadRepo.findOne({
      where: { id },
    });
    if (!variedad)
      throw new NotFoundException(`Variedad con id ${id} no encontrada`);
    return variedad;
  }

  async update(id: string, dto: UpdateVariedadDto): Promise<Variedad> {
    const variedad = await this.findOne(id);
    Object.assign(variedad, dto);
    return await this.variedadRepo.save(variedad);
  }

  async remove(id: string): Promise<void> {
    const variedad = await this.findOne(id);
    await this.variedadRepo.remove(variedad);
  }
}