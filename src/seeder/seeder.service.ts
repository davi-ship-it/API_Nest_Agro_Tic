// src/seeder/seeder.service.ts
import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Asumo que tienes estos servicios y entidades. Ajusta las rutas si es necesario.
import { PermisosService } from '../permisos/permisos.service';
import { Roles as Rol } from '../roles/entities/role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TipoUnidadService } from '../tipo_unidad/tipo_unidad.service';
import { BodegaService } from '../bodega/bodega.service';
import { CategoriaService } from '../categoria/categoria.service';

// Acciones comunes para reutilizar y mantener consistencia
const ACCIONES_CRUD = ['leer', 'crear', 'actualizar', 'eliminar'];
const ACCION_VER = ['ver'];

// Definimos los permisos base que necesita la aplicación
const PERMISOS_BASE = [
  // Módulo de Inicio (Generalmente solo lectura)
  { moduloNombre: 'Inicio', recurso: 'acceso_inicio', acciones: ACCION_VER },
  { moduloNombre: 'Inicio', recurso: 'dashboard', acciones: ['leer'] },

  // Módulo de Usuarios y Roles
  {
    moduloNombre: 'Usuarios',
    recurso: 'acceso_usuarios',
    acciones: ACCION_VER,
  },
  { moduloNombre: 'Usuarios', recurso: 'usuarios', acciones: ACCIONES_CRUD },
  { moduloNombre: 'Usuarios', recurso: 'roles', acciones: ACCIONES_CRUD },

  // Módulo de IOT
  { moduloNombre: 'IOT', recurso: 'acceso_iot', acciones: ACCION_VER },
  { moduloNombre: 'IOT', recurso: 'dispositivos', acciones: ACCIONES_CRUD },
  { moduloNombre: 'IOT', recurso: 'sensores', acciones: ACCIONES_CRUD },
  // Las mediciones no se suelen actualizar o eliminar, solo crear y leer
  { moduloNombre: 'IOT', recurso: 'mediciones', acciones: ['leer', 'crear'] },

  // Módulo de Cultivos
  {
    moduloNombre: 'Cultivos',
    recurso: 'acceso_cultivos',
    acciones: ACCION_VER,
  },
  { moduloNombre: 'Cultivos', recurso: 'cultivos', acciones: ACCIONES_CRUD },
  { moduloNombre: 'Cultivos', recurso: 'lotes', acciones: ACCIONES_CRUD },

  // Módulo Fitosanitario
  {
    moduloNombre: 'Fitosanitario',
    recurso: 'acceso_fitosanitario',
    acciones: ACCION_VER,
  },
  {
    moduloNombre: 'Fitosanitario',
    recurso: 'productos_fitosanitarios',
    acciones: ACCIONES_CRUD,
  },
  {
    moduloNombre: 'Fitosanitario',
    recurso: 'aplicaciones',
    acciones: ACCIONES_CRUD,
  },

  // Módulo de Inventario
  {
    moduloNombre: 'Inventario',
    recurso: 'acceso_inventario',
    acciones: ACCION_VER,
  },
  {
    moduloNombre: 'Inventario',
    recurso: 'items_inventario',
    acciones: ACCIONES_CRUD,
  },
  // Los movimientos son registros, no se editan/borran
  {
    moduloNombre: 'Inventario',
    recurso: 'movimientos_inventario',
    acciones: ['leer', 'crear'],
  },
];

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly permisosService: PermisosService,
    private readonly usuariosService: UsuariosService,
    private readonly tipoUnidadService: TipoUnidadService, // Inyectamos el servicio
    private readonly bodegaService: BodegaService,
    private readonly categoriaService: CategoriaService,
    @InjectRepository(Rol)
    private readonly rolRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Permiso)
    private readonly permisoRepository: Repository<Permiso>,
  ) {}

  async seed() {
    this.logger.log('Iniciando el proceso de seeding...', 'Seeder');

    // 1. Sincronizar Permisos Base usando tu endpoint/servicio
    await this.seedPermisos();

    // 2. Crear los tipos de unidad base
    await this.seedTiposUnidad();

    // 3. Crear bodegas y categorías base
    await this.seedBodegasYCategorias();

    // 2. Crear roles y definir sus jerarquías y permisos
    const rolAdmin = await this.seedRolAdmin();
    const { rolInstructor } = await this.seedRolesAdicionales();

    // 3. Crear el Usuario Administrador
    if (rolAdmin) {
      await this.seedUsuarioAdmin(rolAdmin);
    } else {
      this.logger.error(
        'No se pudo crear el usuario admin porque el rol no fue encontrado o creado.',
        'Seeder',
      );
    }

    // 4. Crear el Usuario Instructor
    if (rolInstructor) {
      await this.seedUsuarioInstructor(rolInstructor);
    } else {
      this.logger.warn(
        'No se pudo crear el usuario instructor porque el rol no fue encontrado.',
        'Seeder',
      );
    }

    this.logger.log('Seeding completado exitosamente.', 'Seeder');
  }

  private async seedPermisos() {
    this.logger.log('Sincronizando permisos base...', 'Seeder');
    try {
      for (const permisoData of PERMISOS_BASE) {
        // Usamos el servicio que ya tienes para evitar duplicados
        await this.permisosService.sincronizarPermisos(permisoData);
      }
      this.logger.log('Permisos base sincronizados.', 'Seeder');
    } catch (error) {
      this.logger.error(
        'Error sincronizando permisos: ' + error.message,
        'Seeder',
      );
    }
  }

  private async seedRolAdmin(): Promise<Rol | null> {
    const nombreRol = 'ADMIN';
    try {
      let rol = await this.rolRepository.findOne({
        where: { nombre: nombreRol },
      });

      if (!rol) {
        this.logger.log(`Creando el rol "${nombreRol}"...`, 'Seeder');
        const todosLosPermisos = await this.permisoRepository.find();
        if (todosLosPermisos.length === 0) {
          this.logger.warn(
            'No se encontraron permisos para asignar al rol admin. ¿Se ejecutó seedPermisos() correctamente?',
            'Seeder',
          );
        }
        rol = this.rolRepository.create({
          nombre: nombreRol,
          permisos: todosLosPermisos,
        });
        await this.rolRepository.save(rol);

        // Asignamos el permiso para que el rol ADMIN pueda crear a otros ADMINs.
        // Esto es crucial para la lógica de jerarquía.
        rol.rolesQuePuedeCrear = [rol];
        await this.rolRepository.save(rol); // Guardamos la relación

        this.logger.log(
          `Rol "${nombreRol}" creado con ${todosLosPermisos.length} permisos.`,
          'Seeder',
        );
      } else {
        this.logger.log(
          `El rol "${nombreRol}" ya existe. Omitiendo creación.`,
          'Seeder',
        );
      }
      return rol;
    } catch (error) {
      this.logger.error(
        `Error creando el rol admin: ${error.message}`,
        'Seeder',
      );
      return null;
    }
  }

  private async seedRolesAdicionales(): Promise<{ rolInstructor: Rol | null }> {
    this.logger.log(
      'Creando roles adicionales y definiendo jerarquías...',
      'Seeder',
    );
    try {
      // Crear roles base si no existen
      let rolInstructor = await this.crearRolSiNoExiste('INSTRUCTOR');
      const rolAprendiz = await this.crearRolSiNoExiste('APRENDIZ');
      const rolPasante = await this.crearRolSiNoExiste('PASANTE');
      const rolInvitado = await this.crearRolSiNoExiste('INVITADO');

      // Asignar permisos específicos al INSTRUCTOR
      const permisoCrearUsuarios = await this.permisoRepository.findOne({
        where: { accion: 'crear', recurso: { nombre: 'usuarios' } },
        relations: ['recurso'],
      });

      if (rolInstructor && permisoCrearUsuarios) {
        // Cargamos el rol con sus permisos para no sobreescribirlos
        const rolInstructorConPermisos = await this.rolRepository.findOne({
          where: { id: rolInstructor.id },
          relations: ['permisos'],
        });

        // ✅ Comprobamos que el rol se encontró antes de usarlo
        if (rolInstructorConPermisos) {
          const tienePermiso = rolInstructorConPermisos.permisos.some(
            (p) => p.id === permisoCrearUsuarios.id,
          );
          if (!tienePermiso) {
            rolInstructorConPermisos.permisos.push(permisoCrearUsuarios);
            await this.rolRepository.save(rolInstructorConPermisos);
            this.logger.log(
              `Permiso 'crear usuarios' asignado a INSTRUCTOR.`,
              'Seeder',
            );
          }
          rolInstructor = rolInstructorConPermisos; // Reasignamos para el resto de la función
        }
      }

      // Definir la jerarquía de creación para el INSTRUCTOR
      if (rolInstructor && rolAprendiz && rolPasante) {
        rolInstructor.rolesQuePuedeCrear = [rolAprendiz, rolPasante];
        await this.rolRepository.save(rolInstructor);
        this.logger.log(
          `Jerarquía para INSTRUCTOR definida. Puede crear: APRENDIZ, PASANTE.`,
          'Seeder',
        );
      }

      return { rolInstructor };
    } catch (error) {
      this.logger.error(
        `Error creando roles adicionales: ${error.message}`,
        'Seeder',
      );
      return { rolInstructor: null };
    }
  }

  private async crearRolSiNoExiste(nombre: string): Promise<Rol> {
    let rol = await this.rolRepository.findOneBy({ nombre });
    if (!rol) {
      rol = this.rolRepository.create({ nombre, permisos: [] });
      await this.rolRepository.save(rol);
      this.logger.log(`Rol "${nombre}" creado.`, 'Seeder');
    }
    return rol;
  }

  private async seedTiposUnidad() {
    this.logger.log('Creando tipos de unidad base...', 'Seeder');
    try {
      const tiposUnidad = [
        // Unidades de peso
        { nombre: 'Kilogramo', simbolo: 'kg' },
        { nombre: 'Gramo', simbolo: 'g' },
        { nombre: 'Tonelada', simbolo: 't' },

        // Unidades de volumen
        { nombre: 'Litro', simbolo: 'L' },
        { nombre: 'Mililitro', simbolo: 'mL' },

        // Unidades de conteo (para herramientas, equipos, etc.)
        { nombre: 'Unidad', simbolo: 'u' },
      ];

      for (const tipo of tiposUnidad) {
        try {
          await this.tipoUnidadService.create(tipo);
          this.logger.log(
            `Tipo de unidad "${tipo.nombre}" (${tipo.simbolo}) creado.`,
            'Seeder',
          );
        } catch (error) {
          if (error instanceof ConflictException) {
            this.logger.log(
              `Tipo de unidad "${tipo.nombre}" ya existe. Omitiendo.`,
              'Seeder',
            );
          } else {
            throw error; // Relanzamos otros errores
          }
        }
      }

      this.logger.log('Tipos de unidad base creados/verificados.', 'Seeder');
    } catch (error) {
      this.logger.error(
        `Error creando tipos de unidad: ${error.message}`,
        'Seeder',
      );
    }
  }

  private async seedBodegasYCategorias() {
    this.logger.log('Creando bodegas y categorías base...', 'Seeder');
    try {
      // --- Crear Bodega ---
      const nombreBodega = 'Bodega Principal';
      const bodegas = await this.bodegaService.findAll();
      let bodega = bodegas.find((b) => b.nombre === nombreBodega);

      if (!bodega) {
        bodega = await this.bodegaService.create({
          nombre: nombreBodega,
          numero: 'B001', // Campo 'numero' añadido para cumplir con la entidad
        });
        this.logger.log(`Bodega "${nombreBodega}" creada.`, 'Seeder');
      } else {
        this.logger.log(
          `Bodega "${nombreBodega}" ya existe. Omitiendo.`,
          'Seeder',
        );
      }

      // --- Crear Categoría "Abono" ---
      const nombreCategoria = 'Abono';
      const categorias = await this.categoriaService.findAll();
      let categoria = categorias.find((c) => c.nombre === nombreCategoria);

      if (!categoria) {
        // Buscamos el tipo de unidad 'Gramos' por su símbolo 'g'
        const tiposUnidad = await this.tipoUnidadService.findAll();
        const tipoUnidadGramos = tiposUnidad.find((tu) => tu.simbolo === 'g');

        if (tipoUnidadGramos) {
          await this.categoriaService.create({
            nombre: nombreCategoria,
            fkTipoUnidadId: tipoUnidadGramos.id,
          });
          this.logger.log(
            `Categoría "${nombreCategoria}" creada con unidad "g".`,
            'Seeder',
          );
        } else {
          this.logger.error(
            'No se encontró el tipo de unidad "g" (Gramos) para crear la categoría "Abono".',
            'Seeder',
          );
        }
      } else {
        this.logger.log(
          `Categoría "${nombreCategoria}" ya existe. Omitiendo.`,
          'Seeder',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error creando bodegas y categorías: ${error.message}`,
        'Seeder',
      );
    }
  }

  private async seedUsuarioAdmin(rolAdmin: Rol) {
    const dniAdmin = 123456789; // DNI por defecto para el admin (como string)
    try {
      const existeUsuario = await this.usuarioRepository.findOne({
        where: { dni: dniAdmin },
      });

      if (!existeUsuario) {
        this.logger.log('Creando el usuario administrador...', 'Seeder');

        // Llamamos al servicio que ya se encarga de hashear y guardar
        await this.usuariosService.createUserByPanel({
          nombres: 'Admin',
          apellidos: 'del Sistema',
          dni: dniAdmin,
          correo: 'admin@example.com',
          password: 'admin123', // 1. Pasamos la contraseña en texto plano
          telefono: 3144518847,
          rolId: rolAdmin.id, // 2. Pasamos el ID del rol que ya obtuvimos
        });

        this.logger.log('Usuario administrador creado.', 'Seeder');
        this.logger.warn(
          `Usuario: ${dniAdmin}, Contraseña: admin123 ¡Cámbiala en producción!`,
          'Seeder',
        );
      } else {
        this.logger.log(
          'El usuario administrador ya existe. Omitiendo creación.',
          'Seeder',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error creando el usuario admin: ${error.message}`,
        'Seeder',
      );
    }
  }

  private async seedUsuarioInstructor(rolInstructor: Rol) {
    const dniInstructor = 987654321;
    try {
      const existeUsuario = await this.usuarioRepository.findOne({
        where: { dni: dniInstructor },
      });

      if (!existeUsuario) {
        this.logger.log('Creando el usuario instructor...', 'Seeder');

        await this.usuariosService.createUserByPanel({
          nombres: 'Instructor',
          apellidos: 'de Prueba',
          dni: dniInstructor,
          correo: 'instructor@example.com',
          password: 'instructor123',
          telefono: 3001234567,
          rolId: rolInstructor.id,
        });

        this.logger.log('Usuario instructor creado.', 'Seeder');
        this.logger.warn(
          `Usuario: ${dniInstructor}, Contraseña: instructor123`,
          'Seeder',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error creando el usuario instructor: ${error.message}`,
        'Seeder',
      );
    }
  }
}
