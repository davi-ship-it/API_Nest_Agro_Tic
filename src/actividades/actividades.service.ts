import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Actividad } from './entities/actividades.entity';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { UpdateActividadeDto } from './dto/update-actividade.dto';

@Injectable()
export class ActividadesService {
  constructor(
    @InjectRepository(Actividad)
    private readonly actividadesRepo: Repository<Actividad>,
  ) {}

  async create(
    dto: CreateActividadeDto & { imgUrl: string },
  ): Promise<Actividad> {
    const actividad: Actividad = this.actividadesRepo.create(dto);
    return await this.actividadesRepo.save(actividad);
  }
  async findAll(): Promise<Actividad[]> {
    return await this.actividadesRepo.find();
  }

  async countByDate(date: string): Promise<number> {
    return await this.actividadesRepo.count({
      where: { fechaAsignacion: new Date(date) },
    });
  }

  async findByDate(date: string): Promise<Actividad[]> {
    return await this.actividadesRepo.find({
      where: { fechaAsignacion: new Date(date) },
      relations: ['categoriaActividad', 'cultivoVariedadZona', 'cultivoVariedadZona.cultivoXVariedad', 'cultivoVariedadZona.cultivoXVariedad.cultivo', 'cultivoVariedadZona.zona', 'usuariosAsignados', 'usuariosAsignados.usuario', 'inventarioUsado', 'inventarioUsado.inventario'],
    });
  }

  async findByDateRange(start: string, end: string): Promise<Actividad[]> {
    return await this.actividadesRepo.find({
      where: { fechaAsignacion: Between(new Date(start), new Date(end)) },
      relations: ['categoriaActividad', 'cultivoVariedadZona', 'cultivoVariedadZona.cultivoXVariedad', 'cultivoVariedadZona.cultivoXVariedad.cultivo', 'cultivoVariedadZona.zona', 'usuariosAsignados', 'usuariosAsignados.usuario', 'inventarioUsado', 'inventarioUsado.inventario'],
    });
  }

  async findOne(id: string): Promise<Actividad> {
    const actividad = await this.actividadesRepo.findOne({ where: { id } });
    if (!actividad)
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    return actividad;
  }

  async update(id: string, dto: UpdateActividadeDto): Promise<Actividad> {
    const actividad = await this.findOne(id);
    Object.assign(actividad, dto);
    return await this.actividadesRepo.save(actividad);
  }

  async remove(id: string): Promise<void> {
    const actividad = await this.findOne(id);
    await this.actividadesRepo.remove(actividad);
  }
}
