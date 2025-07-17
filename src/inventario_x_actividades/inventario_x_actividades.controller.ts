import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventarioXActividadesService } from './inventario_x_actividades.service';
import { CreateInventarioXActividadeDto } from './dto/create-inventario_x_actividade.dto';
import { UpdateInventarioXActividadeDto } from './dto/update-inventario_x_actividade.dto';

@Controller('inventario-x-actividades')
export class InventarioXActividadesController {
  constructor(private readonly inventarioXActividadesService: InventarioXActividadesService) {}

  @Post()
  create(@Body() createInventarioXActividadeDto: CreateInventarioXActividadeDto) {
    return this.inventarioXActividadesService.create(createInventarioXActividadeDto);
  }

  @Get()
  findAll() {
    return this.inventarioXActividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventarioXActividadesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInventarioXActividadeDto: UpdateInventarioXActividadeDto) {
    return this.inventarioXActividadesService.update(+id, updateInventarioXActividadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventarioXActividadesService.remove(+id);
  }
}
