import { IsOptional, IsString, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleWithPermissionsDto {
  @ApiProperty({ description: 'Name of the role', required: false })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiProperty({ description: 'Array of permission IDs', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  permisoIds?: string[];
}