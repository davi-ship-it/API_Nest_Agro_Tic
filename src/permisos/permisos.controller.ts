import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PermisosService } from './permisos.service';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { Permiso } from './entities/permiso.entity';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { Permisos } from './decorators/permisos.decorator';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('permisos')
@Controller('permisos')
export class PermisosController {
  constructor(private readonly permisosService: PermisosService) {}

  /* {
  "recurso": "productos",
  "acciones": ["leer", "crear", "actualizar", "eliminar"]
}*/
  @Post('sincronizar')
  @ApiOperation({ summary: 'Synchronize permissions for a resource' })
  @ApiResponse({ status: 201, description: 'Permissions synchronized successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body(new ValidationPipe()) createPermisoDto: CreatePermisoDto) {
    return this.permisosService.sincronizarPermisos(createPermisoDto);
  }
}
