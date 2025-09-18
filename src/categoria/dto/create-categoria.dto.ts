import { IsString, IsUUID, IsNotEmpty, Length } from 'class-validator';

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  nombre: string;

  @IsUUID()
  @IsNotEmpty()
  fkTipoUnidadId: string;
}
