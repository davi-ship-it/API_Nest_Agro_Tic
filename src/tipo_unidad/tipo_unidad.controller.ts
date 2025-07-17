import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoUnidadService } from './tipo_unidad.service';
import { CreateTipoUnidadDto } from './dto/create-tipo_unidad.dto';
import { UpdateTipoUnidadDto } from './dto/update-tipo_unidad.dto';

@Controller('tipo-unidad')
export class TipoUnidadController {
  constructor(private readonly tipoUnidadService: TipoUnidadService) {}

  @Post()
  create(@Body() createTipoUnidadDto: CreateTipoUnidadDto) {
    return this.tipoUnidadService.create(createTipoUnidadDto);
  }

  @Get()
  findAll() {
    return this.tipoUnidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoUnidadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoUnidadDto: UpdateTipoUnidadDto) {
    return this.tipoUnidadService.update(+id, updateTipoUnidadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoUnidadService.remove(+id);
  }
}
