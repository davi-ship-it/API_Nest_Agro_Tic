import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombres: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  passwordHash: string;

  @IsNumber()
  @IsOptional()
  telefono?: number;

  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  correo: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 8)
  rol: string;

  @IsNumber()
  @IsNotEmpty()
  dni: number;
}
