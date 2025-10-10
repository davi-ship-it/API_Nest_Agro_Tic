import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsOptional,
  Length,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVariedadDto {
  @ApiProperty({ description: 'Name of the variety' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;

  @ApiProperty({ description: 'Crop type ID (optional)' })
  @IsOptional()
  @IsUUID()
  fkTipoCultivoId?: string;
}
