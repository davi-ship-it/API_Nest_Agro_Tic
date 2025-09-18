import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modulo } from './entities/modulo.entity';
import { CreateModuloDto } from './dto/create-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(
    @InjectRepository(Modulo)
    private readonly moduloRepository: Repository<Modulo>,
  ) {}

  // ✅ Crear módulo
  async create(createModuloDto: CreateModuloDto): Promise<Modulo> {
    const existe = await this.moduloRepository.findOne({
      where: { nombre: createModuloDto.nombre },
    });

    if (existe) {
      throw new ConflictException('El módulo ya existe.');
    }

    const modulo = this.moduloRepository.create(createModuloDto);
    return await this.moduloRepository.save(modulo);
  }

  // ✅ Listar todos
  async findAll(): Promise<Modulo[]> {
    return await this.moduloRepository.find({ relations: ['recursos'] });
  }

  // ✅ Buscar por ID
  async findOne(id: string): Promise<Modulo> {
    const modulo = await this.moduloRepository.findOne({
      where: { id },
      relations: ['recursos'],
    });
    if (!modulo) {
      throw new NotFoundException(`El módulo con ID ${id} no existe.`);
    }
    return modulo;
  }

  // ✅ Actualizar
  async update(id: string, updateDto: CreateModuloDto): Promise<Modulo> {
    const modulo = await this.findOne(id);
    Object.assign(modulo, updateDto);
    return await this.moduloRepository.save(modulo);
  }

  // ✅ Eliminar
  async remove(id: string): Promise<void> {
    const modulo = await this.findOne(id);
    await this.moduloRepository.remove(modulo);
  }
}
