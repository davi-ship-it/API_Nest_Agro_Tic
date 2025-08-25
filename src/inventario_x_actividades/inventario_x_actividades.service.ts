import { Injectable } from '@nestjs/common';
import { CreateInventarioXActividadesDto } from './dto/create-inventario_x_actividades.dto';
import { UpdateInventarioXActividadesDto } from './dto/update-inventario_x_actividades.dto';

@Injectable()
export class InventarioXActividadesService {
  create(createInventarioXActividadeDto: CreateInventarioXActividadesDto) {
    return 'This action adds a new inventarioXActividade';
  }

  findAll() {
    return `This action returns all inventarioXActividades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventarioXActividade`;
  }

  update(
    id: number,
    updateInventarioXActividadeDto: UpdateInventarioXActividadesDto,
  ) {
    return `This action updates a #${id} inventarioXActividade`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventarioXActividade`;
  }
}
