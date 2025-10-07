import { IsUUID, IsOptional, IsNumber } from 'class-validator';

export class CreateInventarioXActividadesDto {
  @IsUUID()
  @IsOptional()
  fkInventarioId?: string;

  @IsUUID()
  @IsOptional()
  fkActividadId?: string;

  @IsNumber()
  @IsOptional()
  cantidadUsada?: number;
}
