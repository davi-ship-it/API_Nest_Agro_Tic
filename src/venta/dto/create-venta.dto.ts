import { IsNotEmpty, IsNumber, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class MultipleHarvestDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsNumber()
  cantidad: number;
}

export class CreateVentaDto {
  @IsNumber()
  @IsNotEmpty()
  cantidad: number;

  @IsString()
  @IsOptional()
  fecha?: string;

  @IsString()
  @IsNotEmpty()
  fkCosechaId: string;

  @IsNumber()
  @IsOptional()
  precioKilo?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MultipleHarvestDto)
  multipleHarvests?: MultipleHarvestDto[];
}
