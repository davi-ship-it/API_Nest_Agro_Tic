import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
import { Response } from 'express';
import { CultivosVariedadXZonaService } from './cultivos_variedad_x_zona.service';
import { CreateCultivosVariedadXZonaDto } from './dto/create-cultivos_variedad_x_zona.dto';
import { UpdateCultivosVariedadXZonaDto } from './dto/update-cultivos_variedad_x_zona.dto';
import { SearchCultivoDto } from '../cultivos/dto/search-cultivo.dto';

@Controller('cultivos-variedad-x-zona')
export class CultivosVariedadXZonaController {
  constructor(private readonly cultivosVariedadXZonaService: CultivosVariedadXZonaService) {}

  @Post()
  create(@Body() createCultivosVariedadXZonaDto: CreateCultivosVariedadXZonaDto) {
    return this.cultivosVariedadXZonaService.create(createCultivosVariedadXZonaDto);
  }

  @Get()
  findAll() {
    return this.cultivosVariedadXZonaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cultivosVariedadXZonaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCultivosVariedadXZonaDto: UpdateCultivosVariedadXZonaDto) {
    return this.cultivosVariedadXZonaService.update(id, updateCultivosVariedadXZonaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cultivosVariedadXZonaService.remove(id);
  }

  @Post('search')
  search(@Body() dto: SearchCultivoDto) {
    return this.cultivosVariedadXZonaService.search(dto);
  }

  @Get('export')
  async exportAll(@Res() res: Response) {
    const buffer = await this.cultivosVariedadXZonaService.exportToExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="cultivos.xlsx"',
    });
    res.send(buffer);
  }

  @Post('export')
  async exportFiltered(@Body() dto: SearchCultivoDto, @Res() res: Response) {
    const buffer = await this.cultivosVariedadXZonaService.exportToExcel(dto);
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="cultivos_filtrados.xlsx"',
    });
    res.send(buffer);
  }
}

