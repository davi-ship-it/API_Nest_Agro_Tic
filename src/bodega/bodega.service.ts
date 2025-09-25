// src/bodega/bodega.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bodega } from '../../src/bodega/entities/bodega.entity';
import { CreateBodegaDto } from './dto/create-bodega.dto';
import { UpdateBodegaDto } from './dto/update-bodega.dto';

@Injectable()
export class BodegaService {
  constructor(
    @InjectRepository(Bodega)
    private readonly bodegaRepository: Repository<Bodega>,
  ) {}

  async create(createBodegaDto: CreateBodegaDto) {
    const bodega = this.bodegaRepository.create(createBodegaDto);
    const savedBodega = await this.bodegaRepository.save(bodega);

    return {
      message: 'Bodega registrada exitosamente ✅',
      bodega: savedBodega,
    };
  }

  async findAll(): Promise<Bodega[]> {
    return this.bodegaRepository.find({ relations: ['inventarios'] });
  }

  async findOne(id: string): Promise<Bodega> {
    const bodega = await this.bodegaRepository.findOne({
      where: { id },
      relations: ['inventarios'],
    });

    if (!bodega) {
      throw new NotFoundException(`Bodega con id ${id} no encontrada ❌`);
    }
    return bodega;
  }

  async update(id: string, updateBodegaDto: UpdateBodegaDto) {
    const bodega = await this.findOne(id);
    Object.assign(bodega, updateBodegaDto);
    const updatedBodega = await this.bodegaRepository.save(bodega);

    return {
      message: 'Bodega actualizada exitosamente ✅',
      bodega: updatedBodega,
    };
  }

  async remove(id: string) {
    const result = await this.bodegaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bodega con id ${id} no encontrada ❌`);
    }
    return {
      message: `Bodega con id ${id} eliminada correctamente ✅`,
    };
  }
}

