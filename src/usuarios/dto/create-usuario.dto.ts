import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'First names of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombres: string;

  @ApiProperty({ description: 'Last names of the user' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  apellidos: string;

  @ApiProperty({ description: 'Password (optional for registration)' })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Phone number' })
  @IsNumber()
  telefono: number;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  correo: string;

  @ApiProperty({ description: 'Role ID' })
  @IsString()
  @IsNotEmpty()
  rolId: string;

  @ApiProperty({ description: 'DNI number' })
  @IsNumber()
  @IsNotEmpty()
  dni: number;

  @ApiProperty({ description: 'Ficha ID (optional)' })
  @IsOptional()
  @IsString()
  fichaId?: string;
}
