// src/auth/dto/register-auth.dto.ts
import { IsString, IsEmail, IsNumber, MinLength, IsNotEmpty } from 'class-validator';

export class RegisterAuthDto {
  @IsNumber()
  @IsNotEmpty()
  dni: number;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty()
  password: string;
}