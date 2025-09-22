import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateTipoUnidadDto } from './dto/create-tipo_unidad.dto';
import { UpdateTipoUnidadDto } from './dto/update-tipo_unidad.dto';
import { TipoUnidad } from './entities/tipo_unidad.entity';

@Injectable()
export class TipoUnidadService {
  constructor(
    @InjectRepository(TipoUnidad)
    private readonly tipoUnidadRepository: Repository<TipoUnidad>,
  ) {}

  async create(createTipoUnidadDto: CreateTipoUnidadDto): Promise<TipoUnidad> {
    const { nombre, simbolo } = createTipoUnidadDto;

    const existe = await this.tipoUnidadRepository.findOne({
      where: [{ nombre }, { simbolo }],
    });

    if (existe) {
      throw new ConflictException(
        `El tipo de unidad con nombre "${nombre}" o símbolo "${simbolo}" ya existe.`,
      );
    }

    const tipoUnidad = this.tipoUnidadRepository.create(createTipoUnidadDto);
    return this.tipoUnidadRepository.save(tipoUnidad);
  }

  findAll(): Promise<TipoUnidad[]> {
    return this.tipoUnidadRepository.find();
  }

  async findOne(id: string): Promise<TipoUnidad> {
    const tipoUnidad = await this.tipoUnidadRepository.findOneBy({ id });
    if (!tipoUnidad) {
      throw new NotFoundException(
        `Tipo de unidad con ID "${id}" no encontrado.`,
      );
    }
    return tipoUnidad;
  }

  async update(
    id: string,
    updateTipoUnidadDto: UpdateTipoUnidadDto,
  ): Promise<TipoUnidad> {
    const tipoUnidad = await this.findOne(id);

    if (updateTipoUnidadDto.nombre || updateTipoUnidadDto.simbolo) {
      const query = this.tipoUnidadRepository
        .createQueryBuilder('tu')
        .where('tu.id != :id', { id });

      // Usamos Brackets para agrupar las condiciones con un OR
      query.andWhere(
        new Brackets((qb) => {
          if (updateTipoUnidadDto.nombre) {
            qb.orWhere('tu.nombre = :nombre', {
              nombre: updateTipoUnidadDto.nombre,
            });
          }
          if (updateTipoUnidadDto.simbolo) {
            qb.orWhere('tu.simbolo = :simbolo', {
              simbolo: updateTipoUnidadDto.simbolo,
            });
          }
        }),
      );

      const conflicto = await query.getOne();

      if (conflicto) {
        throw new ConflictException(
          `Ya existe otro tipo de unidad con ese nombre o símbolo.`,
        );
      }
    }

    this.tipoUnidadRepository.merge(tipoUnidad, updateTipoUnidadDto);
    return this.tipoUnidadRepository.save(tipoUnidad);
  }

  async remove(id: string): Promise<void> {
    const result = await this.tipoUnidadRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Tipo de unidad con ID "${id}" no encontrado.`,
      );
    }
  }
}
