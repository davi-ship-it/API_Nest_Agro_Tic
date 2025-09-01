import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCultivosVariedadXZonaDto {
    @IsNumber()
    @IsNotEmpty()
    fkCultivosXVariedadId: number;

    @IsNumber()
    @IsNotEmpty()
    fkZonaId: number;
}

