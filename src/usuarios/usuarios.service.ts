// src/usuarios/usuarios.service.ts
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Roles } from '../roles/entities/role.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Roles)
    private readonly rolRepository: Repository<Roles>,
  ) {}

  /**
   * Crea un usuario con un rol específico.
   * Este método debería ser llamado solo por un administrador autenticado.
   */
  async createUserByPanel(createUserDto: CreateUsuarioDto) {
    const {nombres, apellidos, dni, correo, password, telefono, rolId } = createUserDto;

    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [{ dni }, { correo }],
    });
    if (usuarioExistente) {
      throw new ConflictException('El DNI o el correo ya están registrados.');
    }

    const rol = await this.rolRepository.findOneBy({ id: rolId });
    if (!rol) {
      throw new NotFoundException(`El rol con ID "${rolId}" no fue encontrado.`);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      nombres,
      apellidos,
      dni,
      telefono,
      correo,
      passwordHash,
      rol,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    const { passwordHash: _, ...usuarioCreado } = nuevoUsuario;
    return usuarioCreado;
  }


findAll() {

 return `This action returns all usuarios`;
}

findOne(id: number) {

 return `This action returns a #${id} usuario`;

}



update(id: number, updateUsuarioDto: UpdateUsuarioDto) {

return `This action updates a #${id} usuario`;

}



remove(id: number) {

return `This action removes a #${id} usuario`;

}

  

  

}