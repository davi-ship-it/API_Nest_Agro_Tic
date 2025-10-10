import { IsArray, IsUUID, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FinalizeReservationDto {
  @ApiProperty({ description: 'Reservation ID' })
  @IsUUID()
  reservaId: string;

  @ApiProperty({ description: 'Returned quantity', required: false })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  cantidadDevuelta?: number;
}

export class FinalizeActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  @IsUUID()
  actividadId: string;

  @ApiProperty({ description: 'List of reservations to finalize', type: [FinalizeReservationDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FinalizeReservationDto)
  reservas: FinalizeReservationDto[];
}