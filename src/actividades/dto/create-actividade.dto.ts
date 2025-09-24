import { IsString, IsNotEmpty, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActividadeDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaInicio: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  fechaFin?: Date;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsUUID()
  @IsNotEmpty()
  fkCultivoVariedadZonaId: string;
}
