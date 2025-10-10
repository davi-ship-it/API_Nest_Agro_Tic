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
import { UnidadesMedidaService } from './unidades_medida.service';
import { CreateUnidadesMedidaDto } from './dto/create-unidades_medida.dto';
import { UpdateUnidadesMedidaDto } from './dto/update-unidades_medida.dto';

@ApiTags('unidades_medida')
@Controller('unidades-medida')
export class UnidadesMedidaController {
  constructor(private readonly unidadesMedidaService: UnidadesMedidaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new unit of measure' })
  @ApiResponse({ status: 200, description: 'Unit of measure created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUnidadesMedidaDto: CreateUnidadesMedidaDto) {
    return this.unidadesMedidaService.create(createUnidadesMedidaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all units of measure' })
  @ApiResponse({ status: 200, description: 'List of units of measure' })
  findAll() {
    return this.unidadesMedidaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a unit of measure by ID' })
  @ApiResponse({ status: 200, description: 'Unit of measure found' })
  @ApiResponse({ status: 404, description: 'Unit of measure not found' })
  findOne(@Param('id') id: string) {
    return this.unidadesMedidaService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a unit of measure by ID' })
  @ApiResponse({ status: 200, description: 'Unit of measure updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Unit of measure not found' })
  update(
    @Param('id') id: string,
    @Body() updateUnidadesMedidaDto: UpdateUnidadesMedidaDto,
  ) {
    return this.unidadesMedidaService.update(id, updateUnidadesMedidaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a unit of measure by ID' })
  @ApiResponse({ status: 200, description: 'Unit of measure deleted successfully' })
  @ApiResponse({ status: 404, description: 'Unit of measure not found' })
  remove(@Param('id') id: string) {
    return this.unidadesMedidaService.remove(id);
  }
}