import { IsUUID, IsNumber, IsBoolean, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLotesInventarioDto {
  @ApiProperty({ description: 'Foreign key to the product', example: 'uuid-string' })
  @IsUUID()
  fkProductoId: string;

  @ApiProperty({ description: 'Foreign key to the warehouse', example: 'uuid-string' })
  @IsUUID()
  fkBodegaId: string;

  @ApiProperty({ description: 'Available quantity', example: 100.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  cantidadDisponible: number;

  @ApiProperty({ description: 'Reserved quantity', example: 10.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  cantidadReservada: number;

  @ApiProperty({ description: 'Is partial', example: false })
  @IsBoolean()
  esParcial: boolean;

  @ApiPropertyOptional({ description: 'Expiration date', example: '2024-12-31' })
  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;
}