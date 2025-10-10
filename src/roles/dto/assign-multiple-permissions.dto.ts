import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignMultiplePermissionsDto {
  @ApiProperty({ description: 'Array of permission IDs to assign', type: [String] })
  @IsArray()
  @IsNotEmpty()
  @IsUUID('all', { each: true })
  permisoIds: string[];
}