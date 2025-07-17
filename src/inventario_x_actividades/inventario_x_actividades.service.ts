import { Injectable } from '@nestjs/common';
import { CreateInventarioXActividadeDto } from './dto/create-inventario_x_actividade.dto';
import { UpdateInventarioXActividadeDto } from './dto/update-inventario_x_actividade.dto';

@Injectable()
export class InventarioXActividadesService {
  create(createInventarioXActividadeDto: CreateInventarioXActividadeDto) {
    return 'This action adds a new inventarioXActividade';
  }

  findAll() {
    return `This action returns all inventarioXActividades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventarioXActividade`;
  }

  update(id: number, updateInventarioXActividadeDto: UpdateInventarioXActividadeDto) {
    return `This action updates a #${id} inventarioXActividade`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventarioXActividade`;
  }
}
