import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservasXActividad } from './entities/reservas_x_actividad.entity';
import { CreateReservasXActividadDto } from './dto/create-reservas_x_actividad.dto';
import { UpdateReservasXActividadDto } from './dto/update-reservas_x_actividad.dto';

@Injectable()
export class ReservasXActividadService {
  constructor(
    @InjectRepository(ReservasXActividad)
    private readonly reservasXActividadRepo: Repository<ReservasXActividad>,
  ) {}

  async create(createDto: CreateReservasXActividadDto): Promise<ReservasXActividad> {
    const entity = this.reservasXActividadRepo.create(createDto);
    return await this.reservasXActividadRepo.save(entity);
  }

  async findAll(): Promise<ReservasXActividad[]> {
    return await this.reservasXActividadRepo.find({ relations: ['actividad', 'lote', 'estado'] });
  }

  async findOne(id: string): Promise<ReservasXActividad> {
    const entity = await this.reservasXActividadRepo.findOne({
      where: { id },
      relations: ['actividad', 'lote', 'estado'],
    });
    if (!entity) throw new NotFoundException(`ReservasXActividad con ID ${id} no encontrado`);
    return entity;
  }

  async update(id: string, updateDto: UpdateReservasXActividadDto): Promise<ReservasXActividad> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.reservasXActividadRepo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.reservasXActividadRepo.remove(entity);
  }
}