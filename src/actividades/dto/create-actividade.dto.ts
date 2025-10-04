<<<<<<< HEAD
import { IsString, IsNotEmpty, IsDate, IsOptional, IsUUID, IsNumber, IsBoolean } from 'class-validator';
=======
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsUUID,
} from 'class-validator';
>>>>>>> b104bf1c376b7a9654786d3b5ee60243f4e8529a
import { Type } from 'class-transformer';

export class CreateActividadeDto {
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  fechaAsignacion: Date;

  @IsNumber()
  @IsNotEmpty()
  horasDedicadas: number;

  @IsString()
  @IsNotEmpty()
  observacion: string;

  @IsBoolean()
  @IsOptional()
  estado?: boolean;

  @IsUUID()
  @IsNotEmpty()
  fkCultivoVariedadZonaId: string;

  @IsUUID()
  @IsNotEmpty()
  fkCategoriaActividadId: string;
}
