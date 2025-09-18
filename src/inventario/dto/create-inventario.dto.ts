import { IsString, IsNumber, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventarioDto {
  @IsString()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @Type(() => Number)
  @IsNumber()
  stock: number;

  @Type(() => Number)
  @IsNumber()
  precio: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  capacidadUnidad?: number;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsOptional()
  @IsUUID()
  fkCategoriaId?: string;

  @IsOptional()
  @IsUUID()
  fkBodegaId?: string;
}
