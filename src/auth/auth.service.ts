import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

import { Usuario } from '../usuarios/entities/usuario.entity';
import { Roles } from '../roles/entities/role.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RolesService } from 'src/roles/roles.service';

import { CreatePermisoDto } from 'src/permisos/dto/create-permiso.dto'; // ✅ Importa el DTO unificado

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Roles)
    private readonly rolRepository: Repository<Roles>,
    private readonly rolesService: RolesService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService, // Inyectado para leer variables .env
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   * Registra un nuevo usuario público con el rol por defecto 'INVITADO'.
   * No devuelve un token.
   */
  async register(registerDto: RegisterAuthDto) {
    const { dni, correo, password, nombres, apellidos } = registerDto;

    const usuarioExistente = await this.usuarioRepository.findOne({
      where: [{ dni }, { correo }],
    });

    if (usuarioExistente) {
      throw new ConflictException('El DNI o el correo ya están registrados.');
    }

    const rolInvitado = await this.rolRepository.findOne({
      where: { nombre: 'INVITADO' },
    });

    if (!rolInvitado) {
      throw new InternalServerErrorException(
        'El rol por defecto "INVITADO" no se encuentra configurado.',
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const nuevoUsuario = this.usuarioRepository.create({
      dni,
      nombres,
      apellidos,
      correo,
      passwordHash,
      rol: rolInvitado,
    });

    await this.usuarioRepository.save(nuevoUsuario);

    const { passwordHash: _, ...usuarioSinPassword } = nuevoUsuario;

    return {
      message: 'Usuario registrado exitosamente. Por favor, inicie sesión.',
      usuario: usuarioSinPassword,
    };
  }

  /**
   * [MODIFICADO] Autentica a un usuario y devuelve un access_token (corto) y un refresh_token (largo).
   * Guarda la sesión del refresh token en Redis.
   */
  async login(loginDto: LoginAuthDto) {
    const { dni, password } = loginDto;
    const usuario = await this.usuarioRepository.findOne({
      where: { dni },
      relations: ['rol'],
    });

    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.correo,
      rol: usuario.rol?.nombre,
    };

    const [accessToken, refreshToken] = await Promise.all([
      // Access Token (corta duración, ej: 15m)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
        

        
      }),

      

      // Refresh Token (larga duración, ej: 30d)
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_EXPIRATION_TIME',
        ),
      }),
    ]);

    console.log(this.configService.get<string>('JWT_EXPIRATION_TIME')); // Debugging line

    // Hashear el refresh token antes de guardarlo en Redis
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    // Guardar el hash en Redis con un TTL de 30 días
    const ttl = 30 * 24 * 60 * 60; // 30 días en segundos
    await this.cacheManager.set(`session:${usuario.id}`, refreshTokenHash, ttl);

    return {
      message: 'Inicio de sesión exitoso',
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /**
   * [NUEVO] Valida un refresh token y emite un nuevo access token.
   */ async refreshToken(refreshToken: string) {
    try {
      // 1. Decodificar el token para obtener el payload (incluyendo el ID del usuario)
      // Usamos el secreto del refresh token para asegurarnos de que es válido
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const userId = payload.sub;

      // 2. El resto de la lógica es la misma que ya teníamos
      const storedTokenHash = await this.cacheManager.get<string>(
        `session:${userId}`,
      );

      if (!storedTokenHash) {
        throw new UnauthorizedException('Sesión no encontrada o expirada.');
      }

      const tokensMatch = await bcrypt.compare(refreshToken, storedTokenHash);

      if (!tokensMatch) {
        throw new UnauthorizedException('El token de refresco es inválido.');
      }

      const usuario = await this.usuarioRepository.findOne({
        where: { id: userId },
        relations: ['rol'],
      });

      // Añadir una validación para el caso en que el usuario no se encuentre en la BD
      if (!usuario) {
        throw new UnauthorizedException(
          'El usuario asociado a este token ya no existe.',
        );
      }

      const newPayload = {
        sub: usuario.id,
        email: usuario.correo,
        rol: usuario.rol?.nombre,
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME'),
      });

      return {
        message: 'Token actualizado',
        access_token: newAccessToken,
      };
    } catch (error) {
      // Si verifyAsync falla (token expirado, inválido, etc.), lanzamos un error
      throw new UnauthorizedException(
        'El token de refresco es inválido o ha expirado.',
      );
    }
  }
  /**
   * [NUEVO] Cierra la sesión del usuario eliminando su refresh token de Redis.
   */
  async logout(userId: string) {
    await this.cacheManager.del(`session:${userId}`);
    return { message: 'Sesión cerrada exitosamente' };
  }

  /**
   * Obtiene los permisos de un usuario a través de su rol.
   * Realiza una sola consulta a la base de datos para mayor eficiencia.
   */

  /*
  async getUserPermissions(userId: string): Promise<any> {
    // Se recomienda definir un tipo para los permisos
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['rol', 'rol.permisos'], // Carga el rol y los permisos asociados al rol
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    console.log(user)

    if (!user.rol) {
      throw new InternalServerErrorException(
        `El usuario no tiene un rol asignado.`,
      );
    }

    return user.rol.permisos; // Devuelve los permisos del rol
  }*/

  // ✅ CAMBIO 2: Se usa CreatePermisoDto como el tipo de retorno de la promesa.
  async getUserPermissions(userId: string): Promise<CreatePermisoDto[]> {
    const user = await this.usuarioRepository.findOne({
      where: { id: userId },
      relations: ['rol', 'rol.permisos', 'rol.permisos.recurso'],
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID "${userId}" no encontrado.`);
    }

    if (!user.rol || !user.rol.permisos) {
      return [];
    }

    const permisosAgrupados = user.rol.permisos.reduce((acc, permiso) => {
      const nombreRecurso = permiso.recurso.nombre;

      if (!acc[nombreRecurso]) {
        acc[nombreRecurso] = {
          recurso: nombreRecurso,
          acciones: [],
        };
      }

      acc[nombreRecurso].acciones.push(permiso.accion);

      return acc;
      // ✅ CAMBIO 3: El type assertion ahora apunta al DTO unificado.
    }, {} as Record<string, CreatePermisoDto>);

    return Object.values(permisosAgrupados);
  }

    


}
