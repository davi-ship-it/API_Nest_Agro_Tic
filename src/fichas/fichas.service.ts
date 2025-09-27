import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ficha } from './entities/ficha.entity';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';

@Injectable()
export class FichasService {
  constructor(
    @InjectRepository(Ficha)
    private readonly fichasRepo: Repository<Ficha>,
  ) {}

  async create(dto: CreateFichaDto) {
    const ficha = this.fichasRepo.create({
      ...dto,
      cultivo: { id: dto.cultivoId }, // Relacionar por FK
    });
    return this.fichasRepo.save(ficha);
  }

  findAll() {
    return this.fichasRepo.find({
      relations: ['cultivo', 'actividades', 'recursos', 'roles'],
    });
  }

  async findOne(id: string) {
    const ficha = await this.fichasRepo.findOne({
      where: { id },
      relations: ['cultivo', 'actividades', 'recursos', 'roles'],
    });

    if (!ficha) {
      throw new NotFoundException(`La ficha con id ${id} no existe`);
    }

    return ficha;
  }

  async update(id: string, dto: UpdateFichaDto) {
    await this.fichasRepo.update({ id }, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
    const ficha = await this.findOne(id); 
    return this.fichasRepo.remove(ficha);
  }
}

