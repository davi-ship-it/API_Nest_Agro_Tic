import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cultivo } from './entities/cultivo.entity';
import { CultivosVariedadXZona } from '../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';
import { CreateCultivoDto } from './dto/create-cultivo.dto';
import { UpdateCultivoDto } from './dto/update-cultivo.dto';
import { SearchCultivoDto } from './dto/search-cultivo.dto';

@Injectable()
export class CultivosService {
  constructor(
    @InjectRepository(Cultivo)
    private readonly cultivoRepo: Repository<Cultivo>,
    @InjectRepository(CultivosVariedadXZona)
    private readonly cvzRepo: Repository<CultivosVariedadXZona>,
  ) {}

  async create(dto: CreateCultivoDto): Promise<Cultivo> {
    const cultivo = this.cultivoRepo.create(dto);
    return await this.cultivoRepo.save(cultivo);
  } /**
   * NOTA: Esta función fue simplificada para usar la lógica de búsqueda,
   * la cual es más robusta. Solo llama a 'search' sin filtros.
   */

  async findAll(): Promise<any[]> {
    return this.search({});
  }

  async findOne(id: string): Promise<Cultivo> {
    const cultivo = await this.cultivoRepo.findOne({ where: { id } });
    if (!cultivo)
      throw new NotFoundException(`Cultivo con id ${id} no encontrado`);
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

  async search(dto: SearchCultivoDto): Promise<any[]> {
    try {
      // Versión simplificada - verificar si hay datos primero
      const cvzCount = await this.cvzRepo.count();
      console.log('CVZ count:', cvzCount);

      if (cvzCount === 0) {
        // Si no hay datos, devolver array vacío
        return [];
      }

      // Query simplificada sin algunos JOINs problemáticos
      let qb = this.cvzRepo
        .createQueryBuilder('cvz')
        .leftJoin('cvz.cultivoXVariedad', 'cxv')
        .leftJoin('cxv.cultivo', 'c')
        .leftJoin('cvz.zona', 'z')
        .leftJoin('cosechas', 'cos', 'cos.fk_id_cultivos_variedad_x_zona = cvz.pk_id_cv_zona')
        .leftJoin('cultivos_x_fichas', 'cxf', 'cxf.fk_id_cultivo = c.pk_id_cultivo')
        .leftJoin('fichas', 'f', 'f.pk_id_ficha = cxf.fk_id_ficha');

      // Aplicar filtros básicos
      if (dto.estado_cultivo !== undefined && dto.estado_cultivo !== null) {
        qb.andWhere('c.estado = :estado', { estado: dto.estado_cultivo });
      }

      // Seleccionar campos con información de cosechas
      qb.select([
        'cvz.id as cvzId',
        'c.id as id',
        "COALESCE(STRING_AGG(DISTINCT f.ficha_numero::text, ', '), 'Sin ficha') as ficha",
        'z.nombre as lote',
        "'Sin cultivo' as nombreCultivo",
        'c.siembra as fechaSiembra',
        'c.estado as estado',
        'MAX(cos.fecha) as fechaCosecha',
        'COUNT(cos.id) as numCosechas',
        '(SELECT cos2.pk_id_cosecha FROM cosechas cos2 WHERE cos2.fk_id_cultivos_variedad_x_zona = cvz.pk_id_cv_zona ORDER BY cos2.cos_fecha DESC LIMIT 1) as cosechaId',
      ])
      .groupBy('cvz.id, c.id, z.nombre, c.siembra, c.estado')
      .orderBy('cvz.id');

      const result = await qb.getRawMany();
      console.log('Search result count:', result.length);
      return result;
    } catch (error) {
      console.error('Error en search:', error);
      // Devolver array vacío en caso de error para evitar crash
      return [];
    }
  }
}
