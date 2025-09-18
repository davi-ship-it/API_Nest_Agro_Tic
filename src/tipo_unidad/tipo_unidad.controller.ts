import { Controller, Get, Post, Body, Param, Put, Delete, ParseUUIDPipe } from '@nestjs/common';
import { TipoUnidadService } from './tipo_unidad.service';
import { CreateTipoUnidadDto } from './dto/create-tipo_unidad.dto';
import { UpdateTipoUnidadDto } from './dto/update-tipo_unidad.dto';
import { TipoUnidad } from './entities/tipo_unidad.entity';

@Controller('tipo-unidad')
export class TipoUnidadController {
  constructor(private readonly tipoUnidadService: TipoUnidadService) {}

  @Post()
  create(@Body() dto: CreateTipoUnidadDto): Promise<TipoUnidad> {
    return this.tipoUnidadService.create(dto);
  }

  @Get()
  findAll(): Promise<TipoUnidad[]> {
    return this.tipoUnidadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<TipoUnidad> {
    return this.tipoUnidadService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateTipoUnidadDto): Promise<TipoUnidad> {
    return this.tipoUnidadService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
    return this.tipoUnidadService.remove(id);
  }
}
