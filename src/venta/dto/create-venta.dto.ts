import { IsNotEmpty, IsNumber, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVentaDto {
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fecha: Date;

  @IsNumber()
  @IsNotEmpty()
  fkCosechaId: number;

  @IsNumber()
  @IsOptional()
  precioKilo?: number;

  @IsNumber()
  @IsOptional()
  ventaTotal?: number;
}
