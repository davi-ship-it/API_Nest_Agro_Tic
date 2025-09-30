// src/usuarios/usuarios.service.ts
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';
import { Roles } from '../roles/entities/role.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UpdateMeDto } from './dto/update-me.dto';

// Interfaz para tipar el payload del usuario que viene del token JWT
interface RequestingUser {
  rol: string; // e.g., 'ADMIN', 'INSTRUCTOR'
}

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
  async createUserByPanel(
    createUserDto: CreateUsuarioDto,
    requestingUser?: RequestingUser,
  ) {
    const { nombres, apellidos, dni, correo, password, telefono, rolId } =
      createUserDto;

    // 1. Buscamos el rol que se quiere asignar para obtener su nombre.
    const rolAAsignar = await this.rolRepository.findOneBy({ id: rolId });
    if (!rolAAsignar) {
      throw new NotFoundException(
        `El rol con ID "${rolId}" no fue encontrado.`,
      );
    }

    // 2. Lógica de autorización (solo si la petición viene de un usuario autenticado)
    // Si es el seeder, `requestingUser` será undefined y se saltará esta lógica.
    if (requestingUser) {
      // Buscamos el rol completo del usuario que hace la petición,
      // incluyendo la relación de los roles que puede crear.
      const rolSolicitante = await this.rolRepository.findOne({
        where: { nombre: requestingUser.rol },
        relations: ['rolesQuePuedeCrear'],
      });

      if (!rolSolicitante) {
        throw new ForbiddenException('Tu rol no fue encontrado o es inválido.');
      }

      // Regla de Oro: El ADMIN siempre puede hacer todo.
      if (rolSolicitante.nombre !== 'ADMIN') {
        // Para otros roles, verificamos si el rol a asignar está en su lista de permitidos.
        const puedeCrear = rolSolicitante.rolesQuePuedeCrear.some(
          (rolPermitido) => rolPermitido.id === rolAAsignar.id,
        );

        if (!puedeCrear) {
          throw new ForbiddenException(
            `No tienes permiso para crear usuarios con el rol "${rolAAsignar.nombre}".`,
          );
        }
      }
    }

    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [{ dni }, { correo }],
    });
    if (usuarioExistente) {
      throw new ConflictException('El DNI o el correo ya están registrados.');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      nombres,
      apellidos,
      dni,
      telefono,
      correo,
      passwordHash,
      rol: rolAAsignar, // Usamos el rol que ya buscamos
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

  async findMe(userId: string): Promise<Omit<Usuario, 'passwordHash'>> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['rol', 'rol.permisos', 'rol.permisos.recurso', 'rol.permisos.recurso.modulo', 'ficha'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    const { passwordHash, ...result } = user;

    return result;
  }

  async updateMe(userId: string, updateProfileDto: UpdateMeDto): Promise<Omit<Usuario, 'passwordHash'>> {
    const user = await this.usuarioRepository.preload({
      id: userId,
      ...updateProfileDto,
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    const updatedUser = await this.usuarioRepository.save(user);
    const { passwordHash, ...result } = updatedUser;
    return result;
  }

  async findByDni(dni: number) {
    const user = await this.usuarioRepository.findOne({
      where: { dni },
      relations: ['ficha', 'rol'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con DNI "${dni}" no encontrado.`);
    }

    return {
      numero_documento: user.dni,
      nombres: user.nombres,
      apellidos: user.apellidos,
      correo_electronico: user.correo,
      telefono: user.telefono,
      id_ficha: user.ficha?.id || 'No tiene ficha',
      rol: user.rol?.nombre,
    };
  }
}
