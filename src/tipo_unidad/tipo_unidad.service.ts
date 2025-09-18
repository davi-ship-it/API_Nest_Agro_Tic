import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoUnidad } from './entities/tipo_unidad.entity';
import { CreateTipoUnidadDto } from './dto/create-tipo_unidad.dto';
import { UpdateTipoUnidadDto } from './dto/update-tipo_unidad.dto';

@Injectable()
export class TipoUnidadService {
  constructor(
    @InjectRepository(TipoUnidad)
    private readonly tipoUnidadRepo: Repository<TipoUnidad>,
  ) {}

  async create(dto: CreateTipoUnidadDto): Promise<TipoUnidad> {
    const tipoUnidad = this.tipoUnidadRepo.create(dto);
    return await this.tipoUnidadRepo.save(tipoUnidad);
  }

  async findAll(): Promise<TipoUnidad[]> {
    return await this.tipoUnidadRepo.find();
  }

  async findOne(id: string): Promise<TipoUnidad> {
    const tipoUnidad = await this.tipoUnidadRepo.findOneBy({ id });
    if (!tipoUnidad) {
      throw new NotFoundException(`TipoUnidad con id ${id} no encontrado`);
    }
    return tipoUnidad;
  }

  async update(id: string, dto: UpdateTipoUnidadDto): Promise<TipoUnidad> {
    const tipoUnidad = await this.tipoUnidadRepo.preload({
      id,
      ...dto,
    });
    if (!tipoUnidad) {
      throw new NotFoundException(`TipoUnidad con id ${id} no encontrado`);
    }
    return this.tipoUnidadRepo.save(tipoUnidad);
  }

  async remove(id: string): Promise<{ message: string }> {
    const result = await this.tipoUnidadRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TipoUnidad con id ${id} no encontrado`);
    }
    return { message: `TipoUnidad con id ${id} eliminado correctamente.` };
  }
}
