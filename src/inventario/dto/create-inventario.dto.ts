import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

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
  capacidadUnidad: number;

  @IsOptional()
  @IsDateString()
  fechaVencimiento?: string;

  @IsOptional()
  @IsString()
  imgUrl?: string;

  @IsUUID() // Asumiendo que son UUIDs
  @IsNotEmpty()
  fkCategoriaId: string;

  @IsUUID() // Asumiendo que son UUIDs
  @IsNotEmpty()
  fkBodegaId: string;
}
