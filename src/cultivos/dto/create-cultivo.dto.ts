import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCultivoDto {
    @IsString()
    @IsOptional()
    descripcion?: string;

    @IsNumber()
    @IsOptional()
    estado?: number;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    siembra?: Date;
}
