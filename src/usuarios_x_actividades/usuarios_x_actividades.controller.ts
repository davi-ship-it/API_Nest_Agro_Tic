import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsuariosXActividadesService } from './usuarios_x_actividades.service';
import { CreateUsuariosXActividadeDto } from './dto/create-usuarios_x_actividade.dto';
import { UpdateUsuariosXActividadeDto } from './dto/update-usuarios_x_actividade.dto';

@ApiTags('usuarios_x_actividades')
@Controller('usuarios-x-actividades')
export class UsuariosXActividadesController {
  constructor(
    private readonly usuariosXActividadesService: UsuariosXActividadesService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Assign user to activity' })
  @ApiResponse({ status: 200, description: 'Assignment created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUsuariosXActividadeDto: CreateUsuariosXActividadeDto) {
    return this.usuariosXActividadesService.create(
      createUsuariosXActividadeDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all user-activity assignments' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  findAll() {
    return this.usuariosXActividadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment found' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  findOne(@Param('id') id: string) {
    return this.usuariosXActividadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  update(
    @Param('id') id: string,
    @Body() updateUsuariosXActividadeDto: UpdateUsuariosXActividadeDto,
  ) {
    return this.usuariosXActividadesService.update(
      id,
      updateUsuariosXActividadeDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete assignment by ID' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  remove(@Param('id') id: string) {
    return this.usuariosXActividadesService.remove(id);
  }
}
