import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TipoCultivoService } from './tipo_cultivo.service';
import { CreateTipoCultivoDto } from './dto/create-tipo_cultivo.dto';
import { UpdateTipoCultivoDto } from './dto/update-tipo_cultivo.dto';

@Controller('tipo-cultivo')
export class TipoCultivoController {
  constructor(private readonly tipoCultivoService: TipoCultivoService) {}

  @Post()
  create(@Body() createTipoCultivoDto: CreateTipoCultivoDto) {
    return this.tipoCultivoService.create(createTipoCultivoDto);
  }

  @Get()
  findAll() {
    return this.tipoCultivoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoCultivoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTipoCultivoDto: UpdateTipoCultivoDto) {
    return this.tipoCultivoService.update(+id, updateTipoCultivoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tipoCultivoService.remove(+id);
  }
}

