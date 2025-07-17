import { Injectable } from '@nestjs/common';
import { CreateTipoCultivoDto } from './dto/create-tipo_cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo_cultivo.dto';

@Injectable()
export class TipoCultivoService {
  create(createTipoCultivoDto: CreateTipoCultivoDto) {
    return 'This action adds a new tipoCultivo';
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
