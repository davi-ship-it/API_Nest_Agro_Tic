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
import { TipoSensorService } from './tipo_sensor.service';
import { CreateTipoSensorDto } from './dto/create-tipo_sensor.dto';
import { UpdateTipoSensorDto } from './dto/update-tipo_sensor.dto';

@ApiTags('tipo_sensor')
@Controller('tipo-sensor')
export class TipoSensorController {
  constructor(private readonly tipoSensorService: TipoSensorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tipo sensor' })
  @ApiResponse({ status: 201, description: 'Tipo sensor created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTipoSensorDto: CreateTipoSensorDto) {
    return this.tipoSensorService.create(createTipoSensorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tipo sensors' })
  @ApiResponse({ status: 200, description: 'List of tipo sensors' })
  findAll() {
    return this.tipoSensorService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tipo sensor by ID' })
  @ApiResponse({ status: 200, description: 'Tipo sensor details' })
  @ApiResponse({ status: 404, description: 'Tipo sensor not found' })
  findOne(@Param('id') id: string) {
    return this.tipoSensorService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tipo sensor by ID' })
  @ApiResponse({ status: 200, description: 'Tipo sensor updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Tipo sensor not found' })
  update(
    @Param('id') id: string,
    @Body() updateTipoSensorDto: UpdateTipoSensorDto,
  ) {
    return this.tipoSensorService.update(+id, updateTipoSensorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tipo sensor by ID' })
  @ApiResponse({ status: 200, description: 'Tipo sensor deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tipo sensor not found' })
  remove(@Param('id') id: string) {
    return this.tipoSensorService.remove(+id);
  }
}
