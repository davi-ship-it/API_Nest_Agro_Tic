import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZonasService } from './zonas.service';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';

@Controller('zonas')
export class ZonasController {
  constructor(private readonly zonasService: ZonasService) {}

  @Get()
  findAll() {
  return this.zonasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  return this.zonasService.findOne(id);
  }
}

