import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUUID,
  IsDateString,
  IsNumberString
} from 'class-validator';

export class CreateActividadeDto {
  @IsString({ message: 'La descripción debe ser un texto' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
  descripcion: string;

  @IsString({ message: 'La categoría debe ser un texto' })
  @MaxLength(100, { message: 'La categoría no puede tener más de 100 caracteres' })
  @IsOptional()
  categoria?: string;

  @IsNumberString({}, { message: 'El DNI del usuario debe ser un texto numérico' })
  @IsNotEmpty({ message: 'El DNI del usuario no puede estar vacío' })
  @MaxLength(20, { message: 'El DNI no puede tener más de 20 caracteres' })
  dniUsuario: string;

  @IsString({ message: 'El nombre del insumo debe ser un texto' })
  @IsOptional()
  @MaxLength(100, { message: 'El nombre del insumo no puede tener más de 100 caracteres' })
  nombreInventario?: string;

  @IsDateString({}, { message: 'La fecha de inicio debe ser una fecha válida en formato ISO 8601 (YYYY-MM-DD)' })
  @IsNotEmpty({ message: 'La fecha de inicio no puede estar vacía' })
  fechaInicio: string;

  @IsString({ message: 'El nombre de la zona debe ser un texto' })
  @IsOptional() // 👈 ahora opcional
  @MaxLength(100, {
    message: 'El nombre de la zona no puede tener más de 100 caracteres',
  })
  nombreZona?: string;

  @IsUUID('4', { message: 'El ID de cultivo-variedad-zona debe ser un UUID válido' })
  @IsNotEmpty({ message: 'El ID de cultivo-variedad-zona no puede estar vacío' })
  fkCultivoVariedadZonaId: string;
}

