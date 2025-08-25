import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateTipoUnidadDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  nombre: string;
}
