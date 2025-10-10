import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({ description: 'Permission ID to assign' })
  @IsUUID()
  @IsNotEmpty()
  permisoId: string;
}
