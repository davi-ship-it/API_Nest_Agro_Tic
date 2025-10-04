import { Injectable } from '@nestjs/common';
import { CreateCategoriaActividadDto } from './dto/create-categoria_actividad.dto';
import { UpdateCategoriaActividadDto } from './dto/update-categoria_actividad.dto';

@Injectable()
export class CategoriaActividadService {
  create(createCategoriaActividadDto: CreateCategoriaActividadDto) {
    return 'This action adds a new categoriaActividad';
  }

  findAll() {
    return `This action returns all categoriaActividad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoriaActividad`;
  }

  update(id: number, updateCategoriaActividadDto: UpdateCategoriaActividadDto) {
    return `This action updates a #${id} categoriaActividad`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoriaActividad`;
  }
}
