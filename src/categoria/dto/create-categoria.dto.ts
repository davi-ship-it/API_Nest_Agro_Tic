import { IsString, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateCategoriaDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    nombre: string;

    @IsNumber()
    @IsNotEmpty()
    fkTipoUnidadId: number;
}
