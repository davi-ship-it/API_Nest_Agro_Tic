import { PartialType } from '@nestjs/mapped-types';
import { CreateInventarioXActividadeDto } from './create-inventario_x_actividade.dto';

export class UpdateInventarioXActividadeDto extends PartialType(CreateInventarioXActividadeDto) {}
