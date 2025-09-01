import { IsString, IsNotEmpty, IsNumber, IsOptional, IsUrl, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventarioDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsNumber()
    @IsNotEmpty()
    stock: number;

    @IsNumber()
    @IsNotEmpty()
    precio: number;

    @IsNumber()
    @IsOptional()
    capacidadUnidad?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fechaVencimiento?: Date;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    imgUrl: string;

    @IsNumber()
    @IsOptional()
    fkCategoriaId?: number;

    @IsNumber()
    @IsOptional()
    fkBodegaId?: number;
}

