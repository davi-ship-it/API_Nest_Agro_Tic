import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUsuariosXActividadeDto {
  @IsNumber()
  @IsNotEmpty()
  fkUsuarioId: number;

  @IsNumber()
  @IsNotEmpty()
  fkActividadId: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaAsignacion: Date;
}

