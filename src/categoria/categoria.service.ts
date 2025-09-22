import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { TipoUnidad } from '../tipo_unidad/entities/tipo_unidad.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(TipoUnidad)
    private readonly tipoUnidadRepository: Repository<TipoUnidad>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    // Validate fkTipoUnidadId exists
    if (createCategoriaDto.fkTipoUnidadId) {
      const tipoUnidad = await this.tipoUnidadRepository.findOne({
        where: { id: createCategoriaDto.fkTipoUnidadId },
      });
      if (!tipoUnidad) {
        throw new NotFoundException(
          `TipoUnidad with ID ${createCategoriaDto.fkTipoUnidadId} not found`,
        );
      }
    }
    const categoria = this.categoriaRepository.create(createCategoriaDto);
    return await this.categoriaRepository.save(categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: ['tipoUnidad'],
    });
  }

  async findOne(id: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({
      where: { id },
      relations: ['tipoUnidad'],
    });
    if (!categoria) {
      throw new NotFoundException(`Categoria with ID ${id} not found`);
    }
    return categoria;
  }

  async update(
    id: string,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    // Validate fkTipoUnidadId exists if provided
    if (updateCategoriaDto.fkTipoUnidadId) {
      const tipoUnidad = await this.tipoUnidadRepository.findOne({
        where: { id: updateCategoriaDto.fkTipoUnidadId },
      });
      if (!tipoUnidad) {
        throw new NotFoundException(
          `TipoUnidad with ID ${updateCategoriaDto.fkTipoUnidadId} not found`,
        );
      }
    }
    const categoria = await this.categoriaRepository.preload({
      id,
      ...updateCategoriaDto,
    });
    if (!categoria) {
      throw new NotFoundException(`Categoria with ID ${id} not found`);
    }
    return await this.categoriaRepository.save(categoria);
  }

  async remove(id: string): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriaRepository.remove(categoria);
  }
}
