import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';

export class CreateVariedadDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;

  @IsNumber()
  @IsOptional()
  fkTipoCultivoId?: number;
}

