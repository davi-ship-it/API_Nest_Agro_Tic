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
import { RecursosService } from './recursos.service';
import { CreateRecursoDto } from './dto/create-recurso.dto';
import { UpdateRecursoDto } from './dto/update-recurso.dto';

@ApiTags('recursos')
@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new recurso' })
  @ApiResponse({ status: 201, description: 'Recurso created successfully' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createRecursoDto: CreateRecursoDto) {
    return this.recursosService.create(createRecursoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all recursos' })
  @ApiResponse({ status: 200, description: 'List of recursos' })
  findAll() {
    return this.recursosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a recurso by ID' })
  @ApiResponse({ status: 200, description: 'Recurso found' })
  @ApiResponse({ status: 404, description: 'Recurso not found' })
  findOne(@Param('id') id: string) {
    return this.recursosService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a recurso by ID' })
  @ApiResponse({ status: 200, description: 'Recurso updated' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'Recurso not found' })
  update(@Param('id') id: string, @Body() updateRecursoDto: UpdateRecursoDto) {
    return this.recursosService.update(+id, updateRecursoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recurso by ID' })
  @ApiResponse({ status: 200, description: 'Recurso deleted' })
  @ApiResponse({ status: 404, description: 'Recurso not found' })
  remove(@Param('id') id: string) {
    return this.recursosService.remove(+id);
  }
}
