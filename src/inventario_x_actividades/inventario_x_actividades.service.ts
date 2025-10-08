import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventarioXActividad } from './entities/inventario_x_actividades.entity';
import { CreateInventarioXActividadesDto } from './dto/create-inventario_x_actividades.dto';
import { UpdateInventarioXActividadesDto } from './dto/update-inventario_x_actividades.dto';

@Injectable()
export class InventarioXActividadesService {
  constructor(
    @InjectRepository(InventarioXActividad)
    private readonly ixActRepo: Repository<InventarioXActividad>,
  ) {}

  async create(createDto: CreateInventarioXActividadesDto): Promise<InventarioXActividad> {
    const entity = this.ixActRepo.create(createDto);
    return await this.ixActRepo.save(entity);
  }

  async findAll(): Promise<InventarioXActividad[]> {
    return await this.ixActRepo.find({ relations: ['inventario', 'actividad'] });
  }

  async findOne(id: string): Promise<InventarioXActividad> {
    const entity = await this.ixActRepo.findOne({
      where: { id },
      relations: ['inventario', 'actividad'],
    });
    if (!entity) throw new NotFoundException(`InventarioXActividad con ID ${id} no encontrado`);
    return entity;
  }

  async update(id: string, updateDto: UpdateInventarioXActividadesDto): Promise<InventarioXActividad> {
    const entity = await this.findOne(id);
    Object.assign(entity, updateDto);
    return await this.ixActRepo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.ixActRepo.remove(entity);
  }

  async findByActividad(actividadId: string, activo?: boolean): Promise<InventarioXActividad[]> {
    const where: any = { fkActividadId: actividadId };
    if (activo !== undefined) where.activo = activo;
    return await this.ixActRepo.find({
      where,
      relations: ['inventario', 'inventario.categoria'],
    });
  }

  async finalizarByActividad(actividadId: string): Promise<void> {
    await this.ixActRepo.update({ fkActividadId: actividadId }, { activo: false });
  }
}
