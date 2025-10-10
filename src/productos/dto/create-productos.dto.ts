import { IsString, IsOptional, IsNumber, IsBoolean, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductosDto {
  @ApiProperty({ description: 'Name of the product', example: 'Apple', maxLength: 150 })
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiPropertyOptional({ description: 'Description of the product', example: 'Fresh red apple' })
  @IsString()
  @IsOptional()
  descripcion?: string;

  @ApiPropertyOptional({ description: 'SKU of the product', example: 'APP-001', maxLength: 50 })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @ApiProperty({ description: 'Purchase price', example: 1.50 })
  @IsNumber({ maxDecimalPlaces: 2 })
  precioCompra: number;

  @ApiProperty({ description: 'Whether the product is divisible', example: true })
  @IsBoolean()
  esDivisible: boolean;

  @ApiProperty({ description: 'Capacity per presentation', example: 1.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  capacidadPresentacion: number;

  @ApiPropertyOptional({ description: 'Foreign key to category', example: 'uuid-string' })
  @IsUUID()
  @IsOptional()
  fkCategoriaId?: string;

  @ApiPropertyOptional({ description: 'Foreign key to unit of measure', example: 'uuid-string' })
  @IsUUID()
  @IsOptional()
  fkUnidadMedidaId?: string;
}