import { Injectable } from '@nestjs/common';
import { CreateVariedadDto } from './dto/create-variedad.dto';
import { UpdateVariedadDto } from './dto/update-variedad.dto';

@Injectable()
export class VariedadService {
  create(createVariedadDto: CreateVariedadDto) {
    return 'This action adds a new variedad';
  }

  findAll() {
    return `This action returns all variedad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} variedad`;
  }

  update(id: number, updateVariedadDto: UpdateVariedadDto) {
    return `This action updates a #${id} variedad`;
  }

  remove(id: number) {
    return `This action removes a #${id} variedad`;
  }
}
