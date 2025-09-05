import { Injectable } from '@nestjs/common';
import { CreateCultivosVariedadXZonaDto } from './dto/create-cultivos_variedad_x_zona.dto';
import { UpdateCultivosVariedadXZonaDto } from './dto/update-cultivos_variedad_x_zona.dto';

@Injectable()
export class CultivosVariedadXZonaService {
  create(createCultivosVariedadXZonaDto: CreateCultivosVariedadXZonaDto) {
    return 'This action adds a new cultivosVariedadXZona';
  }

  findAll() {
    return `This action returns all cultivosVariedadXZona`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cultivosVariedadXZona`;
  }

  update(id: number, updateCultivosVariedadXZonaDto: UpdateCultivosVariedadXZonaDto) {
    return `This action updates a #${id} cultivosVariedadXZona`;
  }

  remove(id: number) {
    return `This action removes a #${id} cultivosVariedadXZona`;
  }
}

