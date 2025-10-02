// src/actividades/actividades.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actividad } from './entities/actividades.entity';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';
import { CultivosVariedadXZona } from '../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadRepo: Repository<Actividad>,
    @InjectRepository(CultivosVariedadXZona)
    private readonly cultivoVariedadZonaRepo: Repository<CultivosVariedadXZona>,
  ) {}

  async create(dto: CreateActividadeDto): Promise<Actividad> {
    // Verificar que el cultivo-variedad-zona exista
    const cultivoVariedadZona = await this.cultivoVariedadZonaRepo.findOneBy({
      id: dto.fkCultivoVariedadZonaId,
    });
    if (!cultivoVariedadZona) {
      throw new NotFoundException(
        `El cultivo-variedad-zona con ID "${dto.fkCultivoVariedadZonaId}" no fue encontrado.`,
      );
    }

    const actividad = this.actividadRepo.create({
      descripcion: dto.descripcion,
      categoria: dto.categoria,
      dniUsuario: dto.dniUsuario,
      nombreInventario: dto.nombreInventario,
      fechaInicio: new Date(dto.fechaInicio),
      nombreZona: dto.nombreZona,
      fkCultivoVariedadZonaId: dto.fkCultivoVariedadZonaId,
    });

    return this.actividadRepo.save(actividad);
  }

  async findAll(): Promise<Actividad[]> {
    return this.actividadRepo.find({
      relations: ['cultivoVariedadZona', 'usuariosAsignados', 'inventarioUsado'],
    });
  }

  async findOne(id: string): Promise<Actividad> {
    const actividad = await this.actividadRepo.findOne({
      where: { id },
      relations: ['cultivoVariedadZona', 'usuariosAsignados', 'inventarioUsado'],
    });
    if (!actividad) {
      throw new NotFoundException(`Actividad con ID "${id}" no encontrada.`);
    }
    return actividad;
  }

  async update(id: string, dto: UpdateActividadeDto): Promise<Actividad> {
    const actividad = await this.findOne(id);
    // Si se proporciona un nuevo ID de cultivo, verificar que exista antes de asignar.
    if (dto.fkCultivoVariedadZonaId) {
      const cultivoVariedadZona = await this.cultivoVariedadZonaRepo.findOneBy({
        id: dto.fkCultivoVariedadZonaId,
      });
      if (!cultivoVariedadZona) {
        throw new NotFoundException(
          `El cultivo-variedad-zona con ID "${dto.fkCultivoVariedadZonaId}" no fue encontrado.`,
        );
      }
    }

    // Asigna las propiedades del DTO a la entidad, excluyendo la fecha por ahora.
    const { fechaInicio, ...restDto } = dto;
    Object.assign(actividad, restDto);

    // Si se proporciona una nueva fecha, conviértela y asígnala.
    if (dto.fechaInicio) {
      actividad.fechaInicio = new Date(dto.fechaInicio);
    }

    return this.actividadRepo.save(actividad);
  }

  async remove(id: string): Promise<void> {
    await this.actividadRepo.delete(id);
  }
}
