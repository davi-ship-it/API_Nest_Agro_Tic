// File: src/tipo-epa/dto/create-tipo-epa.dto.ts
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoEpaDto {
  @ApiProperty({ description: 'Name of the tipo epa', example: 'Herbicida' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;
}
