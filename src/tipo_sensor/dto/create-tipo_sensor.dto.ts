import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTipoSensorDto {
  @ApiProperty({ description: 'Name of the tipo sensor', example: 'Temperatura' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;

  @ApiPropertyOptional({ description: 'Description of the tipo sensor', example: 'Sensor for measuring temperature' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiProperty({ description: 'Unit of measurement for the sensor', example: 'Celsius' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  unidadMedida: string;
}
