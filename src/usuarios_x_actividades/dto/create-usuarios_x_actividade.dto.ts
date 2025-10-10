import { IsNotEmpty, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuariosXActividadeDto {
  @ApiProperty({ description: 'User ID' })
  @IsUUID()
  @IsNotEmpty()
  fkUsuarioId: string;

  @ApiProperty({ description: 'Activity ID' })
  @IsUUID()
  @IsNotEmpty()
  fkActividadId: string;

  @ApiProperty({ description: 'Assignment date' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  fechaAsignacion: Date;
}
