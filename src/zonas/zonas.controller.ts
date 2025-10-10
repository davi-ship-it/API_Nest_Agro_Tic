import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ZonasService } from './zonas.service';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';

@ApiTags('zonas')
@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new zone' })
  @ApiResponse({ status: 201, description: 'Zone created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createZonaDto: CreateZonaDto) {
    return this.zonasService.create(createZonaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all zones, optionally filtered by name' })
  @ApiResponse({ status: 200, description: 'List of zones' })
  findAll(@Query('nombre') nombre?: string) {
    if (nombre) {
      return this.zonasService.findByNombre(nombre);
    }
    return this.zonasService.findAll();
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search zones by query with pagination' })
  @ApiResponse({ status: 200, description: 'Search results' })
  search(
    @Param('query') query: string,
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    return this.zonasService.search(query, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a zone by ID' })
  @ApiResponse({ status: 200, description: 'Zone details' })
  @ApiResponse({ status: 404, description: 'Zone not found' })
  findOne(@Param('id') id: string) {
    return this.zonasService.findOne(+id);
  }

  @Get(':id/cultivos-variedad-zona')
  @ApiOperation({ summary: 'Get crops and varieties for a zone' })
  @ApiResponse({ status: 200, description: 'Crops and varieties data' })
  getCultivosVariedadXZona(@Param('id') id: string) {
    return this.zonasService.getCultivosVariedadXZona(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a zone by ID' })
  @ApiResponse({ status: 200, description: 'Zone updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Zone not found' })
  update(@Param('id') id: string, @Body() updateZonaDto: UpdateZonaDto) {
    return this.zonasService.update(+id, updateZonaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a zone by ID' })
  @ApiResponse({ status: 200, description: 'Zone deleted successfully' })
  @ApiResponse({ status: 404, description: 'Zone not found' })
  remove(@Param('id') id: string) {
    return this.zonasService.remove(+id);
  }
}
