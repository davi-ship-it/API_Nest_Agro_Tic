import { Injectable } from '@nestjs/common';
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
      cultivo: { id: dto.cultivoId },
    });
    return this.fichasRepo.save(ficha);
  }

  findAll() {
    return this.fichasRepo.find({
      relations: ['cultivo', 'actividades', 'recursos'],
    });
  }

  findOne(id: string) {
    return this.fichasRepo.findOne({
      where: { id },
      relations: ['cultivo', 'actividades', 'recursos'],
    });
  }

  async update(id: string, dto: UpdateFichaDto) {
    await this.fichasRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string) {
  const ficha = await this.findOne(id);
  if (!ficha) {
    throw new Error(`Ficha con id ${id} no encontrada`);
  }
  return this.fichasRepo.remove(ficha);
  }
}
