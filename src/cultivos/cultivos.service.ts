import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
  ) {}

  async create(dto: CreateCultivoDto): Promise<Cultivo> {
    const cultivo = this.cultivoRepo.create(dto);
    return await this.cultivoRepo.save(cultivo);
  }

  async findAll(): Promise<Cultivo[]> {
    return await this.cultivoRepo.find();
  }

  async findOne(id: string): Promise<Cultivo> {
    const cultivo = await this.cultivoRepo.findOne({ where: { id } });
    if (!cultivo) throw new NotFoundException(`Cultivo con id ${id} no encontrado`);
    return cultivo;
  }

  async update(id: string, dto: UpdateCultivoDto): Promise<Cultivo> {
    const cultivo = await this.findOne(id);
    Object.assign(cultivo, dto);
    return await this.cultivoRepo.save(cultivo);
  }

  async remove(id: string): Promise<void> {
    const cultivo = await this.findOne(id);
    await this.cultivoRepo.remove(cultivo);
  }
}