import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCosechaDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 2)
    unidadMedida: string;

    @IsNumber()
    @IsNotEmpty()
    cantidad: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    fecha?: Date;

    @IsNumber()
    @IsNotEmpty()
    fkCultivosXVariedadId: number;
}
