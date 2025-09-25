import { Controller, Get, Post, Put, Body, Query, Param } from '@nestjs/common';
import { FitosanitarioService } from './Fitosanitario.service';
import { CreateFitosanitarioDto } from './dto/create-fitosanitario.dto';
import { UpdateFitosanitarioDto } from './dto/update-fitosanitario.dto';

@Controller('fitosanitario')
export class FitosanitarioController {
  constructor(private readonly fitosanitarioService: FitosanitarioService) {}

  @Get()
  findAll(@Query('nombre') nombre?: string) {
    return this.fitosanitarioService.findAll(nombre);
  }

  @Post()
  create(@Body() createFitosanitarioDto: CreateFitosanitarioDto) {
    return this.fitosanitarioService.create(createFitosanitarioDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFitosanitarioDto: UpdateFitosanitarioDto) {
    return this.fitosanitarioService.update(+id, updateFitosanitarioDto);
  }
}
