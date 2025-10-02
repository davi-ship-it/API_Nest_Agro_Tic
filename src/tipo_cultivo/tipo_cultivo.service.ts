import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoCultivo } from './entities/tipo_cultivo.entity';
import { CreateTipoCultivoDto } from './dto/create-tipo_cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo_cultivo.dto';

@Injectable()
export class TipoCultivoService {
  constructor(
    @InjectRepository(TipoCultivo)
    private tipoCultivoRepository: Repository<TipoCultivo>,
  ) {}

  // CREATE
  async create(
    createTipoCultivoDto: CreateTipoCultivoDto,
  ): Promise<TipoCultivo> {
    const tipoCultivo = this.tipoCultivoRepository.create(createTipoCultivoDto);
    return await this.tipoCultivoRepository.save(tipoCultivo);
  }

  // READ ALL
  async findAll(): Promise<TipoCultivo[]> {
    return await this.tipoCultivoRepository.find();
  }

  // READ ONE
  async findOne(id: string): Promise<TipoCultivo> {
    const tipoCultivo = await this.tipoCultivoRepository.findOne({
      where: { id },
    });
    if (!tipoCultivo) {
      throw new NotFoundException(`TipoCultivo con id ${id} no encontrado`);
    }
    return tipoCultivo;
  }

  // UPDATE
  async update(
    id: string,
    updateTipoCultivoDto: UpdateTipoCultivoDto,
  ): Promise<TipoCultivo> {
    const tipoCultivo = await this.findOne(id);
    const updated = Object.assign(tipoCultivo, updateTipoCultivoDto);
    return await this.tipoCultivoRepository.save(updated);
  }

  // DELETE
  async remove(id: string): Promise<void> {
    const tipoCultivo = await this.findOne(id);
    await this.tipoCultivoRepository.remove(tipoCultivo);
  }
}
