import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateTipoUnidadDto {
  @IsString({ message: 'El nombre debe ser un texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @Length(1, 50, { message: 'El nombre debe tener entre 1 y 50 caracteres.' })
  nombre: string;

  @IsString({ message: 'El símbolo debe ser un texto.' })
  @IsNotEmpty({ message: 'El símbolo no puede estar vacío.' })
  @Length(1, 10, { message: 'El símbolo debe tener entre 1 y 10 caracteres.' })
  simbolo: string;
}
