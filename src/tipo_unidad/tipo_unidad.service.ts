import { Injectable } from '@nestjs/common';
import { CreateTipoUnidadDto } from './dto/create-tipo_unidad.dto';
import { UpdateTipoUnidadDto } from './dto/update-tipo_unidad.dto';

@Injectable()
export class TipoUnidadService {
  create(createTipoUnidadDto: CreateTipoUnidadDto) {
    return 'This action adds a new tipoUnidad';
  }

  findAll() {
    return `This action returns all tipoUnidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tipoUnidad`;
  }

  update(id: number, updateTipoUnidadDto: UpdateTipoUnidadDto) {
    return `This action updates a #${id} tipoUnidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} tipoUnidad`;
  }
}

