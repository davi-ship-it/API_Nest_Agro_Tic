import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import { CultivosVariedadXZona } from './entities/cultivos_variedad_x_zona.entity';
import { CreateCultivosVariedadXZonaDto } from './dto/create-cultivos_variedad_x_zona.dto';
import { UpdateCultivosVariedadXZonaDto } from './dto/update-cultivos_variedad_x_zona.dto';

@Injectable()
export class CultivosVariedadXZonaService {
  constructor(
    @InjectRepository(CultivosVariedadXZona)
    private readonly cvzRepository: Repository<CultivosVariedadXZona>,
  ) {}

  async create(createCultivosVariedadXZonaDto: CreateCultivosVariedadXZonaDto): Promise<CultivosVariedadXZona> {
    const cvz = this.cvzRepository.create({
      fkCultivosXVariedadId: createCultivosVariedadXZonaDto.fkCultivosXVariedadId.toString(),
      fkZonaId: createCultivosVariedadXZonaDto.fkZonaId.toString(),
    });
    return await this.cvzRepository.save(cvz);
  }

  async findAll(): Promise<CultivosVariedadXZona[]> {
    return await this.cvzRepository.find({
      relations: [
        'cultivoXVariedad',
        'cultivoXVariedad.cultivo',
        'cultivoXVariedad.variedad',
        'cultivoXVariedad.variedad.tipoCultivo',
        'zona',
        'actividades',
        'actividades.usuariosAsignados',
        'actividades.usuariosAsignados.usuario',
        'actividades.usuariosAsignados.usuario.ficha',
      ],
    });
  }

  async findOne(id: string): Promise<CultivosVariedadXZona> {
    const cvz = await this.cvzRepository.findOne({
      where: { id },
      relations: [
        'cultivoXVariedad',
        'cultivoXVariedad.cultivo',
        'cultivoXVariedad.variedad',
        'cultivoXVariedad.variedad.tipoCultivo',
        'zona',
        'actividades',
        'actividades.usuariosAsignados',
        'actividades.usuariosAsignados.usuario',
        'actividades.usuariosAsignados.usuario.ficha',
      ],
    });
    if (!cvz) {
      throw new NotFoundException(`CultivosVariedadXZona con id ${id} no encontrado`);
    }
    return cvz;
  }

  async update(id: string, updateCultivosVariedadXZonaDto: UpdateCultivosVariedadXZonaDto): Promise<CultivosVariedadXZona> {
    const cvz = await this.findOne(id);
    Object.assign(cvz, updateCultivosVariedadXZonaDto);
    return await this.cvzRepository.save(cvz);
  }

  async remove(id: string): Promise<void> {
    const cvz = await this.findOne(id);
    await this.cvzRepository.remove(cvz);
  }

  async search(filters: any): Promise<CultivosVariedadXZona[]> {
    try {
      console.log('Search filters received:', filters);
      const qb = this.cvzRepository.createQueryBuilder('cvz')
        .leftJoinAndSelect('cvz.cultivoXVariedad', 'cxv')
        .leftJoinAndSelect('cxv.cultivo', 'c')
        .leftJoinAndSelect('cxv.variedad', 'v')
        .leftJoinAndSelect('v.tipoCultivo', 'tc')
        .leftJoinAndSelect('cvz.zona', 'z')
        .leftJoinAndSelect('cvz.actividades', 'a')
        .leftJoinAndSelect('a.usuariosAsignados', 'uxa')
        .leftJoinAndSelect('uxa.usuario', 'u')
        .leftJoinAndSelect('u.ficha', 'f');

      // Buscar por zona
      if (filters.buscar) {
        qb.andWhere('z.nombre ILIKE :buscar', { buscar: `%${filters.buscar}%` });
      }

      // Buscar por cultivo (variedad o tipo)
      if (filters.buscar_cultivo) {
        qb.andWhere('(v.nombre ILIKE :buscarCultivo OR tc.nombre ILIKE :buscarCultivo)', {
          buscarCultivo: `%${filters.buscar_cultivo}%`,
        });
      }

      // Filtrar por fecha de siembra
      if (filters.fecha_inicio || filters.fecha_fin) {
        if (filters.fecha_inicio && filters.fecha_fin) {
          // Rango completo
          qb.andWhere('c.siembra BETWEEN :inicio AND :fin', {
            inicio: filters.fecha_inicio,
            fin: filters.fecha_fin,
          });
        } else if (filters.fecha_inicio) {
          // Solo fecha inicio (desde)
          qb.andWhere('c.siembra >= :inicio', { inicio: filters.fecha_inicio });
        } else if (filters.fecha_fin) {
          // Solo fecha fin (hasta)
          qb.andWhere('c.siembra <= :fin', { fin: filters.fecha_fin });
        }
      }

      // Filtrar por titulado (usuario con ficha)
      if (filters.id_titulado) {
        qb.andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('1')
            .from('actividades', 'a2')
            .leftJoin('usuarios_x_actividades', 'uxa2', 'uxa2.fk_id_actividad = a2.pk_id_actividad')
            .leftJoin('usuarios', 'u2', 'u2.pk_id_usuario = uxa2.fk_id_usuario')
            .leftJoin('fichas', 'f2', 'f2.pk_id_ficha = u2.fk_id_ficha')
            .where('a2.fk_id_cultivo_variedad_x_zona = cvz.pk_id_cv_zona')
            .andWhere('f2.ficha_numero = :idTitulado')
            .getQuery();
          return 'EXISTS (' + subQuery + ')';
        }, { idTitulado: parseInt(filters.id_titulado) });
      }

      // Buscar por ficha
      if (filters.buscar_ficha) {
        qb.andWhere(qb => {
          const subQuery = qb.subQuery()
            .select('1')
            .from('actividades', 'a2')
            .leftJoin('usuarios_x_actividades', 'uxa2', 'uxa2.fk_id_actividad = a2.pk_id_actividad')
            .leftJoin('usuarios', 'u2', 'u2.pk_id_usuario = uxa2.fk_id_usuario')
            .leftJoin('fichas', 'f2', 'f2.pk_id_ficha = u2.fk_id_ficha')
            .where('a2.fk_id_cultivo_variedad_x_zona = cvz.pk_id_cv_zona')
            .andWhere('CAST(f2.ficha_numero AS TEXT) ILIKE :buscarFicha')
            .getQuery();
          return 'EXISTS (' + subQuery + ')';
        }, { buscarFicha: `%${filters.buscar_ficha}%` });
      }

      // Filtrar por estado del cultivo
      if (filters.estado_cultivo !== undefined && filters.estado_cultivo !== null) {
        qb.andWhere('c.estado = :estado', { estado: parseInt(filters.estado_cultivo) });
      }

      const result = await qb.getMany();
      console.log(`Search returned ${result.length} results`);
      return result;
    } catch (error) {
      console.error('Error in search method:', error);
      throw error;
    }
  }

  async exportToExcel(filters?: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cultivos');

    // Definir columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Tipo de Cultivo', key: 'tipoCultivo', width: 20 },
      { header: 'Variedad', key: 'variedad', width: 20 },
      { header: 'Estado del Cultivo', key: 'estadoCultivo', width: 15 },
      { header: 'Fecha de Siembra', key: 'fechaSiembra', width: 15 },
      { header: 'Zona', key: 'zona', width: 20 },
      { header: 'Tipo de Lote', key: 'tipoLote', width: 15 },
      { header: 'Coordenada X', key: 'coorX', width: 12 },
      { header: 'Coordenada Y', key: 'coorY', width: 12 },
      { header: 'Ficha', key: 'ficha', width: 10 },
      { header: 'Actividades', key: 'actividades', width: 30 },
    ];

    // Estilo del header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE6E6FA' }
    };

    // Obtener datos
    let cultivos: CultivosVariedadXZona[];
    if (filters) {
      cultivos = await this.search(filters);
    } else {
      cultivos = await this.findAll();
    }

    // Agregar filas de datos
    cultivos.forEach((cultivo) => {
      const actividades = cultivo.actividades?.map(a => a.nombre).join(', ') || '';
      const fichas = [...new Set(cultivo.actividades?.flatMap(a => a.usuariosAsignados?.map(uxa => uxa.usuario?.ficha?.numero).filter(Boolean)) || [])].join(', ');

      worksheet.addRow({
        id: cultivo.id,
        tipoCultivo: cultivo.cultivoXVariedad?.variedad?.tipoCultivo?.nombre || '',
        variedad: cultivo.cultivoXVariedad?.variedad?.nombre || '',
        estadoCultivo: cultivo.cultivoXVariedad?.cultivo?.estado === 1 ? 'Activo' : 'Inactivo',
        fechaSiembra: cultivo.cultivoXVariedad?.cultivo?.siembra ?
          new Date(cultivo.cultivoXVariedad.cultivo.siembra).toLocaleDateString('es-ES') : '',
        zona: cultivo.zona?.nombre || '',
        tipoLote: cultivo.zona?.tipoLote || '',
        coorX: cultivo.zona?.coorX || '',
        coorY: cultivo.zona?.coorY || '',
        ficha: fichas,
        actividades: actividades,
      });
    });

    // Generar buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as any;
  }
}

