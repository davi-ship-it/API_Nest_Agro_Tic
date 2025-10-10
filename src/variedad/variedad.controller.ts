import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VariedadesService } from './variedad.service';
import { CreateVariedadDto } from './dto/create-variedad.dto';
import { UpdateVariedadDto } from './dto/update-variedad.dto';

@ApiTags('variedad')
@Controller('variedades')
export class VariedadesController {
  constructor(private readonly variedadesService: VariedadesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new variety' })
  @ApiResponse({ status: 200, description: 'Variety created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() dto: CreateVariedadDto) {
    return this.variedadesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all varieties' })
  @ApiResponse({ status: 200, description: 'List of varieties' })
  findAll() {
    return this.variedadesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a variety by ID' })
  @ApiResponse({ status: 200, description: 'Variety found' })
  @ApiResponse({ status: 404, description: 'Variety not found' })
  findOne(@Param('id') id: string) {
    return this.variedadesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a variety by ID' })
  @ApiResponse({ status: 200, description: 'Variety updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Variety not found' })
  update(@Param('id') id: string, @Body() dto: UpdateVariedadDto) {
    return this.variedadesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a variety by ID' })
  @ApiResponse({ status: 200, description: 'Variety deleted successfully' })
  @ApiResponse({ status: 404, description: 'Variety not found' })
  remove(@Param('id') id: string) {
    return this.variedadesService.remove(id);
  }
}
