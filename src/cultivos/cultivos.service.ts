import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { SearchCultivoDto } from './dto/search-cultivo.dto';

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

async search(dto: SearchCultivoDto): Promise<Cultivo[]> {
  const qb = this.cultivoRepo.createQueryBuilder('c')
    .leftJoin('c.variedades', 'cxv')
    .leftJoin('cxv.variedad', 'v')
    .leftJoin('v.tipoCultivo', 'tc')
    .leftJoin('cvz.zona', 'z') // relación con tabla zonas
    .leftJoin('cvz.actividades', 'a')
    .leftJoin('a.usuariosAsignados', 'uxa')
    .leftJoin('uxa.usuario', 'u');

  // Buscar por ZONA (zona.nombre en vez de c.lote)
  if (dto.buscar) {
  qb.andWhere('z.nombre LIKE :buscar', { buscar: `%${dto.buscar}%` });
}

  // Buscar por cultivo (variedad o tipoCultivo)
  if (dto.buscar_cultivo) {
    qb.andWhere('(v.nombre LIKE :buscarCultivo OR tc.nombre LIKE :buscarCultivo)', {
      buscarCultivo: `%${dto.buscar_cultivo}%`,
    });
  }

  // Filtrar por rango de fechas de siembra
  if (dto.fecha_inicio && dto.fecha_fin) {
    qb.andWhere('c.siembra BETWEEN :inicio AND :fin', {
      inicio: dto.fecha_inicio,
      fin: dto.fecha_fin,
    });
  }

  // Filtrar por rango de fechas de cosecha (usando mismos nombres de DTO)
  if (dto.fecha_inicio && dto.fecha_fin) {
    qb.andWhere('c.cosecha BETWEEN :inicioCosecha AND :finCosecha', {
      inicioCosecha: dto.fecha_inicio,
      finCosecha: dto.fecha_fin,
    });
  }

  // Filtrar por titulado (usuario)
  if (dto.id_titulado) {
    qb.andWhere('u.id = :idTitulado', { idTitulado: dto.id_titulado });
  }

  // Filtrar por estado del cultivo
  if (dto.estado_cultivo !== undefined) {
    qb.andWhere('c.estado = :estado', { estado: dto.estado_cultivo });
  }

  return qb.getMany();
}
}
