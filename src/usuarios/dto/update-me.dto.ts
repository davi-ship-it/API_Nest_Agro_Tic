// src/usuarios/dto/update-me.dto.ts
import {
  IsString,
  IsEmail,
  IsOptional,
  Length,
  IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMeDto {
  @ApiProperty({ description: 'First names (optional)' })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  nombres?: string;

  @ApiProperty({ description: 'Last names (optional)' })
  @IsString()
  @IsOptional()
  @Length(1, 50)
  apellidos?: string;

  @ApiProperty({ description: 'Phone number (optional)' })
  @IsNumber()
  @IsOptional()
  telefono?: number;

  @ApiProperty({ description: 'Email address (optional)' })
  @IsEmail()
  @IsOptional()
  @Length(1, 255)
  correo?: string;
}
