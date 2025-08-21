import { Injectable } from '@nestjs/common';
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

  async create(
    createTipoCultivoDto: CreateTipoCultivoDto,
  ): Promise<TipoCultivo> {
    const tipoCultivo = this.tipoCultivoRepository.create(createTipoCultivoDto);
    return await this.tipoCultivoRepository.save(tipoCultivo);
  }

  findAll() {
    return `This action returns all tipoCultivo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoCultivo`;
  }

  update(id: number, updateTipoCultivoDto: UpdateTipoCultivoDto) {
    return `This action updates a #${id} tipoCultivo`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoCultivo`;
  }
}
