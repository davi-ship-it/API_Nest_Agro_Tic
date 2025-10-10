import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO que define la forma de los permisos requeridos en un decorador.
 */
export class CreatePermisoDto {
  /**
   * El nombre del recurso que se quiere proteger.
   * Debe coincidir con el valor en la base de datos.
   * @example 'productos'
   */
  @ApiProperty({ description: 'Name of the resource to protect', example: 'productos' })
  @IsString({ message: 'El recurso debe ser una cadena de texto.' })
  @IsNotEmpty({ message: 'El recurso no puede estar vacío.' })
  recurso: string;

  /**
   * Lista de acciones requeridas para acceder al recurso.
   * @example ['crear', 'leer']
   */
  @ApiProperty({ description: 'List of required actions for the resource', example: ['crear', 'leer'], type: [String] })
  @IsArray({ message: 'Las acciones deben ser un arreglo.' })
  @IsString({
    each: true,
    message: 'Cada acción debe ser una cadena de texto.',
  })
  @IsNotEmpty({ message: 'El arreglo de acciones no puede estar vacío.' })
  acciones: string[];

  @ApiProperty({ description: 'Name of the module', example: 'inventory' })
  @IsString({
    each: true,
    message: 'Cada acción debe ser una cadena de texto.',
  })
  @IsNotEmpty({ message: 'El arreglo de acciones no puede estar vacío.' })
  moduloNombre: string;
}
