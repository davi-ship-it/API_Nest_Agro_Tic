import { IsUUID, IsNumber, IsOptional, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservasXActividadDto {
  @ApiProperty({ description: 'Foreign key to the actividad' })
  @IsUUID()
  fkActividadId: string;

  @ApiProperty({ description: 'Foreign key to the lote' })
  @IsUUID()
  fkLoteId: string;

  @ApiProperty({ description: 'Foreign key to the estado' })
  @IsInt()
  fkEstadoId: number;

  @ApiProperty({ description: 'Reserved quantity' })
  @IsNumber({ maxDecimalPlaces: 2 })
  cantidadReservada: number;

  @ApiProperty({ description: 'Used quantity', required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  cantidadUsada?: number;

  @ApiProperty({ description: 'Returned quantity', required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  cantidadDevuelta?: number;
}