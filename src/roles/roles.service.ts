import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Roles> {
    const rol = this.rolesRepository.create(createRoleDto);
    return this.rolesRepository.save(rol);
  }

  async findAll(): Promise<Roles[]> {
    return this.rolesRepository.find();
  }

  async findOne(id: string): Promise<Roles> {
    const rol = await this.rolesRepository.findOneBy({ id });
    if (!rol) {
      throw new NotFoundException(`Rol con ID "${id}" no encontrado`);
    }
    return rol;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Roles> {
    const rol = await this.findOne(id);
    this.rolesRepository.merge(rol, updateRoleDto);
    return this.rolesRepository.save(rol);
  }

  async remove(id: string): Promise<void> {
    const rol = await this.findOne(id);
    await this.rolesRepository.remove(rol);
  }
}
