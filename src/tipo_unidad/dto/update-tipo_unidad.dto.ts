import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoUnidadDto } from './create-tipo_unidad.dto';

export class UpdateTipoUnidadDto extends PartialType(CreateTipoUnidadDto) {}
