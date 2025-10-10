import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateZonaDto {
  @ApiProperty({ description: 'Name of the zone', example: 'Zone A' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;

  @ApiProperty({ description: 'Type of lot', example: 'Type1' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 8)
  tipoLote: string;

  @ApiProperty({ description: 'X coordinate', example: 10.5 })
  @IsNumber()
  @IsNotEmpty()
  coorX: number;

  @ApiProperty({ description: 'Y coordinate', example: 20.3 })
  @IsNumber()
  @IsNotEmpty()
  coorY: number;

  @ApiProperty({ description: 'Foreign key to the map', example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  fkMapaId: string;
}
