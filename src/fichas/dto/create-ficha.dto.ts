import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateFichaDto {
  @IsNumber()
  @IsNotEmpty({ message: 'El número de ficha es obligatorio' })
  numero: number;

  @IsNotEmpty({ message: 'El lote es obligatorio' })
  lote: string;

  @IsDateString()
  @IsNotEmpty({ message: 'La fecha de siembra es obligatoria' })
  fecha_siembra: string;

  @IsDateString()
  fecha_cosecha?: string;

  @IsNotEmpty({ message: 'El cultivo es obligatorio' })
  cultivoId: string; // se relaciona con la tabla cultivos
}
