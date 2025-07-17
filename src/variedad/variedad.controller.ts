import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VariedadService } from './variedad.service';
import { CreateVariedadDto } from './dto/create-variedad.dto';
import { UpdateVariedadDto } from './dto/update-variedad.dto';

@Controller('variedad')
export class VariedadController {
  constructor(private readonly variedadService: VariedadService) {}

  @Post()
  create(@Body() createVariedadDto: CreateVariedadDto) {
    return this.variedadService.create(createVariedadDto);
  }

  @Get()
  findAll() {
    return this.variedadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.variedadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVariedadDto: UpdateVariedadDto) {
    return this.variedadService.update(+id, updateVariedadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.variedadService.remove(+id);
  }
}
