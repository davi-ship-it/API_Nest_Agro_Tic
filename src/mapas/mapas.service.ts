import { Injectable } from '@nestjs/common';
import { CreateMapaDto } from './dto/create-mapa.dto';
import { UpdateMapaDto } from './dto/update-mapa.dto';

@Injectable()
export class MapasService {
  create(createMapaDto: CreateMapaDto) {
    return 'This action adds a new mapa';
  }

  findAll() {
    return `This action returns all mapas`;
  }

  findOne(id: number) {
    return `This action returns a #${id} mapa`;
  }

  update(id: number, updateMapaDto: UpdateMapaDto) {
    return `This action updates a #${id} mapa`;
  }

  remove(id: number) {
    return `This action removes a #${id} mapa`;
  }
}
