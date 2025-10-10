import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ description: 'Name of the role' })
  @IsString()
  @MinLength(3)
  nombre: string;
}
