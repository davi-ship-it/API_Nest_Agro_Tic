import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zona } from './entities/zona.entity';
import { CreateZonaDto } from './dto/create-zona.dto';
import { UpdateZonaDto } from './dto/update-zona.dto';

@Injectable()
export class ZonasService {
  constructor(
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
  ) {}

  async create(createZonaDto: CreateZonaDto): Promise<Zona> {
    const zona = this.zonaRepository.create(createZonaDto);
    return await this.zonaRepository.save(zona);
  }

  async findAll(): Promise<Zona[]> {
    return await this.zonaRepository.find();
  }

  async findByNombre(nombre: string): Promise<Zona[]> {
    return await this.zonaRepository.find({ where: { nombre } });
  }

  async findOne(id: number): Promise<Zona> {
    const zona = await this.zonaRepository.findOne({ where: { id: id.toString() } });
    if (!zona) {
      throw new NotFoundException(`Zona con id ${id} no encontrada`);
    }
    return zona;
  }

  async update(id: number, updateZonaDto: UpdateZonaDto): Promise<Zona> {
    const zona = await this.findOne(id);
    Object.assign(zona, updateZonaDto);
    return await this.zonaRepository.save(zona);
  }

  async remove(id: number): Promise<void> {
    const zona = await this.findOne(id);
    await this.zonaRepository.remove(zona);
  }

  async getCultivosVariedadXZona(zonaId: string) {
    const zona = await this.zonaRepository.findOne({
      where: { id: zonaId },
      relations: [
        'cultivosVariedad.cultivoXVariedad.cultivo',
        'cultivosVariedad.cultivoXVariedad.variedad',
        'cultivosVariedad.cultivoXVariedad.variedad.tipoCultivo'
      ]
    });

    if (!zona) {
      throw new NotFoundException(`Zona con id ${zonaId} no encontrada`);
    }

    return {
      zona: {
        id: zona.id,
        nombre: zona.nombre
      },
      cultivos: zona.cultivosVariedad?.map(cvz => ({
        cvzId: cvz.id,
        cultivo: {
          id: cvz.cultivoXVariedad?.cultivo?.id,
          nombre: cvz.cultivoXVariedad?.variedad?.tipoCultivo?.nombre || 'Tipo Cultivo',
          estado: cvz.cultivoXVariedad?.cultivo?.estado,
          fechaSiembra: cvz.cultivoXVariedad?.cultivo?.siembra
        },
        variedad: {
          id: cvz.cultivoXVariedad?.variedad?.id,
          nombre: cvz.cultivoXVariedad?.variedad?.nombre
        }
      })) || []
    };
  }
}

