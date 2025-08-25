import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, IsUrl } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateActividadeDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;

    @IsString()
    @IsNotEmpty()
    descripcion: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    fechaInicio: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fechaFin?: Date;

    @IsString()
    @IsOptional()
    estado?: string;

    @IsString()
    @IsUrl()
    @IsNotEmpty()
    imgUrl: string;

    @IsNumber()
    @IsNotEmpty()
    fkCultivoVariedadZonaId: number;
}
