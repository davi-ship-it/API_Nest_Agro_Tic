import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTipoCultivoDto {
  @ApiProperty({ description: 'Name of the tipo cultivo', example: 'Maiz' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  nombre: string;
}
