import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUrl,
  IsDate,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSensorDto {
  @ApiProperty({ description: 'Name of the sensor' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;

  @ApiProperty({ description: 'X coordinate' })
  @IsNumber()
  @IsNotEmpty()
  coorX: number;

  @ApiProperty({ description: 'Y coordinate' })
  @IsNumber()
  @IsNotEmpty()
  coorY: number;

  @ApiProperty({ description: 'Minimum range', required: false })
  @IsNumber()
  @IsOptional()
  rangoMinimo?: number;

  @ApiProperty({ description: 'Maximum range', required: false })
  @IsNumber()
  @IsOptional()
  rangoMaximo?: number;

  @ApiProperty({ description: 'Image URL' })
  @IsString()
  @IsUrl()
  @IsNotEmpty()
  img: string;

  @ApiProperty({ description: 'Status' })
  @IsNumber()
  @IsNotEmpty()
  estado: number;

  @ApiProperty({ description: 'Installation date' })
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  fechaInstalacion: Date;

  @ApiProperty({ description: 'Last maintenance date', required: false })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaUltimoMantenimiento?: Date;

  @ApiProperty({ description: 'Foreign key to tipo sensor' })
  @IsNumber()
  @IsNotEmpty()
  fkTipoSensorId: number;

  @ApiProperty({ description: 'Foreign key to zona', required: false })
  @IsNumber()
  @IsOptional()
  fkZonaId?: number;
}
