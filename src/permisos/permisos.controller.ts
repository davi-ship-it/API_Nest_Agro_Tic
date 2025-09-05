import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';

@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  /* {
  "recurso": "productos",
  "acciones": ["leer", "crear", "actualizar", "eliminar"]
}*/

  @Post('sincronizar')
  create(@Body(new ValidationPipe()) createPermisoDto: CreatePermisoDto) {
    return this.permisosService.sincronizarPermisos(createPermisoDto);
  }
}