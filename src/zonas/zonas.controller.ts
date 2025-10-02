import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';

@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Post()
  create(@Body() createZonaDto: CreateZonaDto) {
    return this.zonasService.create(createZonaDto);
  }

  @Get()
  findAll(@Query('nombre') nombre?: string) {
    if (nombre) {
      return this.zonasService.findByNombre(nombre);
    }
    return this.zonasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zonasService.findOne(+id);
  }

  @Get(':id/cultivos-variedad-zona')
  getCultivosVariedadXZona(@Param('id') id: string) {
    return this.zonasService.getCultivosVariedadXZona(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZonaDto: UpdateZonaDto) {
    return this.zonasService.update(+id, updateZonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zonasService.remove(+id);
  }
}

