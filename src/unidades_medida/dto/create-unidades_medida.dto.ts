import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadesMedidaDto {
  @ApiProperty({ description: 'Name of the unit of measure' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({ description: 'Abbreviation of the unit of measure' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  abreviatura: string;
}