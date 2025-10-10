import { IsUUID, IsNumber, IsOptional, IsInt, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovimientosInventarioDto {
  @ApiProperty({ description: 'Foreign key to the lote (batch)', example: 'uuid-string' })
  @IsUUID()
  fkLoteId: string;

  @ApiPropertyOptional({ description: 'Foreign key to the reserva (reservation)', example: 'uuid-string' })
  @IsUUID()
  @IsOptional()
  fkReservaId?: string;

  @ApiProperty({ description: 'Foreign key to the tipo movimiento (movement type)', example: 1 })
  @IsInt()
  fkTipoMovimientoId: number;

  @ApiProperty({ description: 'Quantity of the movement', example: 10.5 })
  @IsNumber({ maxDecimalPlaces: 2 })
  cantidad: number;

  @ApiPropertyOptional({ description: 'Observation or note', example: 'Some observation', maxLength: 255 })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  observacion?: string;
}