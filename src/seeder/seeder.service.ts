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
import { Ficha } from '../fichas/entities/ficha.entity';

// Acciones comunes para reutilizar y mantener consistencia
const ACCIONES_CRUD = ['leer', 'crear', 'actualizar', 'eliminar'];
const ACCION_VER = ['ver'];

// Definimos los permisos base que necesita la aplicación
const PERMISOS_BASE = [
  // Módulo de Inicio (Generalmente solo lectura)
  { moduloNombre: 'Inicio', recurso: 'acceso_inicio', acciones: ACCION_VER },
  { moduloNombre: 'Inicio', recurso: 'dashboard', acciones: ['leer'] },

  { moduloNombre: 'Usuarios', recurso: 'usuarios', acciones: ACCIONES_CRUD },
  { moduloNombre: 'Usuarios', recurso: 'roles', acciones: ACCIONES_CRUD },
  { moduloNombre: 'Usuarios', recurso: 'panel de control', acciones: ['ver'] },

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
    @InjectRepository(Ficha)
    private readonly fichaRepository: Repository<Ficha>,
  ) {}

  async seed() {
    this.logger.log('Iniciando el proceso de seeding...', 'Seeder');

    // 1. Sincronizar Permisos Base usando tu endpoint/servicio
    await this.seedPermisos();

    // 2. Crear los tipos de unidad base
    await this.seedTiposUnidad();

    // 3. Crear bodegas y categorías base
    await this.seedBodegasYCategorias();

    // 4. Crear roles
    const rolAdmin = await this.seedRolAdmin();
    const { rolInstructor, rolAprendiz } = await this.seedRolesAdicionales();

    // 6. Crear el Usuario Administrador
    if (rolAdmin) {
      await this.seedUsuarioAdmin(rolAdmin);
    } else {
      this.logger.error(
        'No se pudo crear el usuario admin porque el rol no fue encontrado o creado.',
        'Seeder',
      );
    }

    // 7. Crear el Usuario Instructor
    if (rolInstructor) {
      await this.seedUsuarioInstructor(rolInstructor);
    } else {
      this.logger.warn(
        'No se pudo crear el usuario instructor porque el rol no fue encontrado.',
        'Seeder',
      );
    }

    // 8. Crear el Usuario Aprendiz
    if (rolAprendiz) {
      await this.seedUsuarioAprendiz(rolAprendiz);
    } else {
      this.logger.warn(
        'No se pudo crear el usuario aprendiz porque el rol no fue encontrado.',
        'Seeder',
      );
    }

    // 9. Crear ficha de muestra y linkear con APRENDIZ
    await this.seedFichaAprendiz();

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

        // No se configura jerarquía compleja, solo validación simple en el servicio

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

  private async seedRolesAdicionales(): Promise<{ rolInstructor: Rol | null, rolAprendiz: Rol | null }> {
    this.logger.log(
      'Creando roles adicionales...',
      'Seeder',
    );
    try {
      // Crear roles base si no existen
      let rolInstructor = await this.crearRolSiNoExiste('INSTRUCTOR');
      const rolAprendiz = await this.crearRolSiNoExiste('APRENDIZ');

      // Crear otros roles sin permisos especiales
      await this.crearRolSiNoExiste('PASANTE');
      await this.crearRolSiNoExiste('INVITADO');

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

      return { rolInstructor, rolAprendiz };
    } catch (error) {
      this.logger.error(
        `Error creando roles adicionales: ${error.message}`,
        'Seeder',
      );
      return { rolInstructor: null, rolAprendiz: null };
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

  private async seedUsuarioAprendiz(rolAprendiz: Rol) {
    const dniAprendiz = 111111111;
    try {
      const existeUsuario = await this.usuarioRepository.findOne({
        where: { dni: dniAprendiz },
      });

      if (!existeUsuario) {
        this.logger.log('Creando el usuario aprendiz...', 'Seeder');

        await this.usuariosService.createUserByPanel({
          nombres: 'Aprendiz',
          apellidos: 'de Prueba',
          dni: dniAprendiz,
          correo: 'aprendiz@example.com',
          password: 'aprendiz123',
          telefono: 3007654321,
          rolId: rolAprendiz.id,
        });

        this.logger.log('Usuario aprendiz creado.', 'Seeder');
        this.logger.warn(
          `Usuario: ${dniAprendiz}, Contraseña: aprendiz123`,
          'Seeder',
        );
      }
    } catch (error) {
      this.logger.error(
        `Error creando el usuario aprendiz: ${error.message}`,
        'Seeder',
      );
    }
  }

  private async seedFichaAprendiz() {
    this.logger.log('Creando ficha de muestra y asignándola al APRENDIZ...', 'Seeder');
    try {
      // Check if ficha exists
      let ficha = await this.fichaRepository.findOne({ where: { numero: 2925484 } });
      if (!ficha) {
        ficha = this.fichaRepository.create({ numero: 2925484 });
        await this.fichaRepository.save(ficha);
        this.logger.log('Ficha 2925484 creada.', 'Seeder');
      } else {
        this.logger.log('Ficha 2925484 ya existe.', 'Seeder');
      }

      // Assign ficha to APRENDIZ user
      const dniAprendiz = 111111111;
      const aprendiz = await this.usuarioRepository.findOne({
        where: { dni: dniAprendiz },
        relations: ['ficha'],
      });
      if (aprendiz) {
        if (!aprendiz.ficha) {
          aprendiz.ficha = ficha;
          await this.usuarioRepository.save(aprendiz);
          this.logger.log('Ficha asignada al usuario APRENDIZ.', 'Seeder');
        } else {
          this.logger.log('El usuario APRENDIZ ya tiene una ficha asignada.', 'Seeder');
        }
      } else {
        this.logger.warn('Usuario APRENDIZ no encontrado para asignar ficha.', 'Seeder');
      }
    } catch (error) {
      this.logger.error(`Error creando o asignando ficha: ${error.message}`, 'Seeder');
    }
  }
}
