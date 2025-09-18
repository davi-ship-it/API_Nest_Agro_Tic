import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { ModulosService } from './modulos.service';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { Modulo } from './entities/modulo.entity';

@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Post()
  create(@Body() createModuloDto: CreateModuloDto): Promise<Modulo> {
    return this.modulosService.create(createModuloDto);
  }

  @Get()
  findAll(): Promise<Modulo[]> {
    return this.modulosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Modulo> {
    return this.modulosService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuloDto: CreateModuloDto,
  ): Promise<Modulo> {
    return this.modulosService.update(id, updateModuloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.modulosService.remove(id);
  }
}
