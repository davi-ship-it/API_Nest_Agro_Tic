
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './entities/inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { Express } from 'express'; // <--- Añadir esta línea
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepo: Repository<Inventario>,
  ) {}

  async create(dto: CreateInventarioDto, file?: Express.Multer.File) {
    const inventarioData = {
      ...dto,
      ...(file && { imgUrl: file.filename }),
    };
    const inventario = this.inventarioRepo.create(inventarioData);
    return await this.inventarioRepo.save(inventario);
  }

  async findAll() {
    return await this.inventarioRepo.find();
  }

  async findOne(id: string) {
    const item = await this.inventarioRepo.findOne({ where: { id } });
    if (!item) throw new NotFoundException(`Inventario con ID ${id} no encontrado.`);
    return item;
  }

  async update(id: string, dto: UpdateInventarioDto, file?: Express.Multer.File) {
    const updateData = {
      ...dto,
      ...(file && { imgUrl: file.filename }),
    };
    const item = await this.inventarioRepo.preload({ id, ...updateData });
    if (!item) throw new NotFoundException(`Inventario con ID ${id} no encontrado.`);
    return await this.inventarioRepo.save(item);
  }

  async remove(id: string) {
    const result = await this.inventarioRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Inventario con ID ${id} no encontrado.`);
    return { message: `Inventario con ID ${id} eliminado correctamente.` };
  }
}
