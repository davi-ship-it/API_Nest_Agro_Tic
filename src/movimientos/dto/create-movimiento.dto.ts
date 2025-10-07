import { IsUUID, IsNumber, IsOptional } from 'class-validator';

export class CreateMovimientoDto {
  @IsUUID()
  fkInventarioId: string;

  @IsNumber()
  @IsOptional()
  stockReservado?: number;

  @IsNumber()
  @IsOptional()
  stockDevuelto?: number;

  @IsNumber()
  @IsOptional()
  stockDevueltoSobrante?: number;

  @IsNumber()
  @IsOptional()
  stockReservadoSobrante?: number;
}
