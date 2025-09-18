import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioXActividadesDto } from './create-inventario_x_actividades.dto';

export class UpdateInventarioXActividadesDto extends PartialType(
  CreateInventarioXActividadesDto,
) {}

