import { Injectable } from '@nestjs/common';
import { CreateBodegaDto } from './dto/create-bodega.dto';
import { UpdateBodegaDto } from './dto/update-bodega.dto';

@Injectable()
export class BodegaService {
  create(createBodegaDto: CreateBodegaDto) {
    return 'This action adds a new bodega';
  }

  findAll() {
    return `This action returns all bodega`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bodega`;
  }

  update(id: number, updateBodegaDto: UpdateBodegaDto) {
    return `This action updates a #${id} bodega`;
  }

  remove(id: number) {
    return `This action removes a #${id} bodega`;
  }
}
