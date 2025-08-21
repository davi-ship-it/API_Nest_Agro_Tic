import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTipoCultivoDto {
  @IsNotEmpty({ message: 'El nombre del tipo de cultivo es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  nombre: string;

  @IsNotEmpty({ message: 'La descripción del tipo de cultivo es requerida' })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion: string;
}
