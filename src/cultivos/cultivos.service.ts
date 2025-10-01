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
    // 1. Inicializar el query builder con todos los JOINS necesarios para la SALIDA (SELECT)
    let qb = this.cultivoRepo
      .createQueryBuilder('c')
      .leftJoin('c.variedades', 'cxv') // Cultivo x Variedad
      .leftJoin('cxv.variedad', 'v') // Variedad
      .leftJoin('v.tipoCultivo', 'tc') // Tipo de Cultivo
      .leftJoin('cxv.zonas', 'cvz') // Cultivo x Variedad x Zona
      .leftJoin('cvz.zona', 'z') // Zona (Lote)
      .leftJoin('cxv.cosechas', 'cos') // Cosechas
      // Join para la Ficha (asumiendo que la tabla se llama 'fichas' y tiene pk_id_ficha)
      .leftJoin('fichas', 'f', 'f.pk_id_ficha = c.fk_id_ficha'); // 2. APLICAR FILTROS (Usando los aliases de los joins definidos arriba)

    if (dto.estado_cultivo !== undefined) {
      qb.andWhere('c.estado = :estado', { estado: dto.estado_cultivo });
    }

    if (dto.id_titulado) {
      qb.andWhere('f.ficha_numero::text ILIKE :titularId', {
        titularId: `%${dto.id_titulado}%`,
      });
    }

    if (dto.buscar) {
      // Filtro de Zona usa el alias 'z'
      qb.andWhere('z.nombre ILIKE :buscar', { buscar: `%${dto.buscar}%` });
    }

    if (dto.buscar_cultivo) {
      // Filtro de Cultivo usa los aliases 'v' y 'tc'
      qb.andWhere('(v.nombre ILIKE :cultivo OR tc.nombre ILIKE :cultivo)', {
        cultivo: `%${dto.buscar_cultivo}%`,
      });
    }

    if (dto.fecha_inicio && dto.fecha_fin) {
      // Filtro de Fechas usa c.siembra y cos.fecha
      qb.andWhere(
        '(c.siembra BETWEEN :fechaInicio AND :fechaFin OR (cos.fecha IS NOT NULL AND cos.fecha BETWEEN :fechaInicio AND :fechaFin))',
        {
          fechaInicio: dto.fecha_inicio,
          fechaFin: dto.fecha_fin,
        },
      );
    } // 3. SELECCIONAR Y AGREGAR (Output de la tabla)

    qb.select([
      'c.id as id', // 1. FICHA
      "COALESCE(f.ficha_numero::text, 'Sin ficha') as ficha", // 2. LOTE/ZONA (STRING_AGG para consolidar múltiples zonas)

      "COALESCE(STRING_AGG(DISTINCT z.nombre, ', '), 'Sin zona') as lote", // 3. NOMBRE CULTIVO (STRING_AGG para consolidar múltiples variedades)

      "COALESCE(STRING_AGG(DISTINCT CONCAT(tc.nombre, ' - ', v.nombre), ', '), 'Sin cultivo') as nombreCultivo", // 4. FECHA SIEMBRA

      'c.siembra as fechaSiembra', // 5. FECHA COSECHA (MAX para obtener la más reciente)

      'MAX(cos.fecha) as fechaCosecha',
    ]) // Agrupamos solo por los campos que NO son agregados
      .groupBy('c.id, c.fk_id_ficha, f.ficha_numero, c.siembra'); // 4. Ejecutar y devolver
    const result = await qb.getRawMany();
    return result;
  }
}
