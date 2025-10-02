// src/actividades/actividades.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ActividadesService } from './actividades.service';
import { CreateActividadeDto } from './dto/create-actividade.dto';
import { Actividad } from './entities/actividades.entity';
import { UpdateActividadeDto } from './dto/update-actividade.dto';

@Controller('actividades')
export class ActividadesController {
  constructor(private readonly actividadesService: ActividadesService) {}

  @Post()
  create(@Body() dto: CreateActividadeDto): Promise<Actividad> {
    return this.actividadesService.create(dto);
  }

  @Get()
  findAll(): Promise<Actividad[]> {
    return this.actividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Actividad> {
    return this.actividadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateActividadeDto,
  ): Promise<Actividad> {
    return this.actividadesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.actividadesService.remove(id);
  }
}
