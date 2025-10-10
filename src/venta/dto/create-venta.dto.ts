import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVentaDto {
  @ApiProperty({ description: 'Quantity of the sale', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @ApiProperty({ description: 'Date of the sale', example: '2023-10-01' })
  @IsString()
  @IsNotEmpty()
  fecha: string;

  @ApiProperty({ description: 'Foreign key to the harvest', example: 'uuid-string' })
  @IsString()
  @IsNotEmpty()
  fkCosechaId: string;

  @ApiPropertyOptional({ description: 'Price per kilo', example: 5.50 })
  @IsNumber()
  @IsOptional()
  precioKilo?: number;
}
