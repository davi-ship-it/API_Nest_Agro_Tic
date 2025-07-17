import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MapasService } from './mapas.service';
import { CreateMapaDto } from './dto/create-mapa.dto';
import { UpdateMapaDto } from './dto/update-mapa.dto';

@Controller('mapas')
export class MapasController {
  constructor(private readonly mapasService: MapasService) {}

  @Post()
  create(@Body() createMapaDto: CreateMapaDto) {
    return this.mapasService.create(createMapaDto);
  }

  @Get()
  findAll() {
    return this.mapasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mapasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMapaDto: UpdateMapaDto) {
    return this.mapasService.update(+id, updateMapaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mapasService.remove(+id);
  }
}
