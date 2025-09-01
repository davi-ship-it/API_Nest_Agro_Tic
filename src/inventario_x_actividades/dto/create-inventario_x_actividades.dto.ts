import { IsNumber, IsOptional } from 'class-validator';

export class CreateInventarioXActividadesDto {
  @IsNumber()
  @IsOptional()
  fkInventarioId?: number;

  @IsNumber()
  @IsOptional()
  fkActividadId?: number;

  @IsNumber()
  @IsOptional()
  cantidadUsada?: number;
}

