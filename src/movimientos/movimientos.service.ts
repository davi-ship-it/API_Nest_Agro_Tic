import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movimiento } from './entities/movimiento.entity';
import { CreateMovimientoDto } from './dto/create-movimiento.dto';
import { UpdateMovimientoDto } from './dto/update-movimiento.dto';

@Injectable()
export class MovimientosService {
  constructor(
    @InjectRepository(Movimiento)
    private readonly movimientoRepo: Repository<Movimiento>,
  ) {}

  async create(createMovimientoDto: CreateMovimientoDto) {
    console.log('Creating movimiento with data:', createMovimientoDto);
    const movimiento = this.movimientoRepo.create(createMovimientoDto);
    console.log('Movimiento entity created:', movimiento);
    const result = await this.movimientoRepo.save(movimiento);
    console.log('Movimiento saved successfully:', result);
    return result;
  }

  async findAll() {
    return await this.movimientoRepo.find({ relations: ['inventario'] });
  }

  async findOne(id: string) {
    const movimiento = await this.movimientoRepo.findOne({ where: { id }, relations: ['inventario'] });
    if (!movimiento) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado.`);
    }
    return movimiento;
  }

  async update(id: string, updateMovimientoDto: UpdateMovimientoDto) {
    const movimiento = await this.findOne(id);
    const updatedMovimiento = this.movimientoRepo.merge(movimiento, updateMovimientoDto);
    return await this.movimientoRepo.save(updatedMovimiento);
  }

  async remove(id: string) {
    const movimiento = await this.findOne(id);
    await this.movimientoRepo.delete(id);
    return { message: `Movimiento con ID ${id} eliminado correctamente.` };
  }
}
