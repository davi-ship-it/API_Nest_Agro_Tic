import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoriaActividadService } from './categoria_actividad.service';
import { CreateCategoriaActividadDto } from './dto/create-categoria_actividad.dto';
import { UpdateCategoriaActividadDto } from './dto/update-categoria_actividad.dto';

@Controller('categoria-actividad')
export class CategoriaActividadController {
  constructor(private readonly categoriaActividadService: CategoriaActividadService) {}

  @Post()
  create(@Body() createCategoriaActividadDto: CreateCategoriaActividadDto) {
    return this.categoriaActividadService.create(createCategoriaActividadDto);
  }

  @Get()
  findAll() {
    return this.categoriaActividadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriaActividadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoriaActividadDto: UpdateCategoriaActividadDto) {
    return this.categoriaActividadService.update(+id, updateCategoriaActividadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriaActividadService.remove(+id);
  }
}
