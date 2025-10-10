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
import { TipoEpaService } from './tipo_epa.service';
import { CreateTipoEpaDto } from './dto/create-tipo_epa.dto';
import { UpdateTipoEpaDto } from './dto/update-tipo_epa.dto';

@ApiTags('tipo_epa')
@Controller('tipo-epa')
export class TipoEpaController {
  constructor(private readonly tipoEpaService: TipoEpaService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tipo epa' })
  @ApiResponse({ status: 201, description: 'Tipo epa created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createTipoEpaDto: CreateTipoEpaDto) {
    return this.tipoEpaService.create(createTipoEpaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tipo epas' })
  @ApiResponse({ status: 200, description: 'List of tipo epas' })
  findAll() {
    return this.tipoEpaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tipo epa by ID' })
  @ApiResponse({ status: 200, description: 'Tipo epa details' })
  @ApiResponse({ status: 404, description: 'Tipo epa not found' })
  findOne(@Param('id') id: string) {
    return this.tipoEpaService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tipo epa by ID' })
  @ApiResponse({ status: 200, description: 'Tipo epa updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Tipo epa not found' })
  update(@Param('id') id: string, @Body() updateTipoEpaDto: UpdateTipoEpaDto) {
    return this.tipoEpaService.update(+id, updateTipoEpaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tipo epa by ID' })
  @ApiResponse({ status: 200, description: 'Tipo epa deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tipo epa not found' })
  remove(@Param('id') id: string) {
    return this.tipoEpaService.remove(+id);
  }
}
