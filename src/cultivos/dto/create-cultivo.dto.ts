import { IsString, IsOptional, IsNumber, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCultivoDto {
  @IsUUID()
  fkFichaId: string;

  @IsNumber()
  @IsOptional()
  estado?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  siembra?: Date;
}
