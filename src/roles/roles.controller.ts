import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseUUIDPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { AssignPermissionDto } from './dto/assign-permission.dto';
import { AssignMultiplePermissionsDto } from './dto/assign-multiple-permissions.dto';
import { UpdateRoleWithPermissionsDto } from './dto/update-role-with-permissions.dto';
import { AuthenticationGuard } from '../common/guards/authentication.guard';
import { AuthorizationGuard } from '../common/guards/authorization.guard';
import { Permisos } from '../permisos/decorators/permisos.decorator';

@UseGuards(AuthenticationGuard, AuthorizationGuard)
@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  /* 

se envia el id del rol al que se le va a asignar el permiso
  http://localhost:3000/roles/2ddc2d7f-8a94-477a-8f24-221c8a230f2e/permisos

  se envia en el body el id del permiso que se le va a asignar al rol
{
  "permisoId": "3518a2d4-c5c2-429c-bfee-bba3aa4e3bd4"
}
  */
  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a role by ID' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role by ID' })
  @ApiResponse({ status: 204, description: 'Role deleted' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }

  // --- Endpoints para gestionar permisos en un rol ---

  @Post(':id/permisos')
  @ApiOperation({ summary: 'Assign a permission to a role' })
  @ApiResponse({ status: 200, description: 'Permission assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  assignPermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    return this.rolesService.assignPermission(
      id,
      assignPermissionDto.permisoId,
    );
  }

  @Post(':id/permisos/multiple')
  @ApiOperation({ summary: 'Assign multiple permissions to a role' })
  @ApiResponse({ status: 200, description: 'Permissions assigned successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Role or permissions not found' })
  assignMultiplePermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignMultiplePermissionsDto: AssignMultiplePermissionsDto,
  ) {
    return this.rolesService.assignMultiplePermissions(id, assignMultiplePermissionsDto.permisoIds);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a role with permissions' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  updateRoleWithPermissions(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRoleWithPermissionsDto: UpdateRoleWithPermissionsDto,
  ) {
    return this.rolesService.updateRoleWithPermissions(id, updateRoleWithPermissionsDto);
  }

  @Delete(':id/permisos/:permisoId')
  @ApiOperation({ summary: 'Remove a permission from a role' })
  @ApiResponse({ status: 200, description: 'Permission removed successfully' })
  @ApiResponse({ status: 404, description: 'Role or permission not found' })
  removePermission(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('permisoId', ParseUUIDPipe) permisoId: string,
  ) {
    return this.rolesService.removePermission(id, permisoId);
  }
}

/*


const data.permisos[]


*/
