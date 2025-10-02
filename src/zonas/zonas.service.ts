import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zona } from './entities/zona.entity';

@Injectable()
export class ZonasService {
  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
  ) {}

  // Devuelve todas las zonas
  async findAll(): Promise<{ id: string; name: string }[]> {
    const zonas = await this.zonaRepository.find();
    // Mapeamos a { id, name } para el frontend
    return zonas.map(z => ({ id: z.id, name: z.nombre }));
  }

  // Devuelve una zona por id
  async findOne(id: string): Promise<Zona | null> {
    return this.zonaRepository.findOne({ where: { id } });
  }
}

