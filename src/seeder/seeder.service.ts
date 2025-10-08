// src/seeder/seeder.service.ts
import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Asumo que tienes estos servicios y entidades. Ajusta las rutas si es necesario.
import { PermisosService } from '../permisos/permisos.service';
import { Roles as Rol } from '../roles/entities/role.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Permiso } from '../permisos/entities/permiso.entity';
import { UsuariosService } from '../usuarios/usuarios.service';
import { TipoUnidadService } from '../tipo_unidad/tipo_unidad.service';
import { BodegaService } from '../bodega/bodega.service';
import { CategoriaService } from '../categoria/categoria.service'; // Asegúrate que la ruta es correcta
import { Ficha } from '../fichas/entities/ficha.entity';
import { TipoCultivo } from '../tipo_cultivo/entities/tipo_cultivo.entity';
import { Variedad } from '../variedad/entities/variedad.entity';
import { Cultivo } from '../cultivos/entities/cultivo.entity';
import { CultivosXVariedad } from '../cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Zona } from '../zonas/entities/zona.entity';
import { Repository } from 'typeorm';
import { CultivosVariedadXZona } from '../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';
import { Actividad } from '../actividades/entities/actividades.entity';
import { UsuarioXActividad } from '../usuarios_x_actividades/entities/usuarios_x_actividades.entity';
import { Inventario } from '../inventario/entities/inventario.entity';
import { Mapa } from '../mapas/entities/mapa.entity';

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
    @InjectRepository(Ficha)
    private readonly fichaRepository: Repository<Ficha>,
    @InjectRepository(TipoCultivo)
    private readonly tipoCultivoRepository: Repository<TipoCultivo>,
    @InjectRepository(Variedad)
    private readonly variedadRepository: Repository<Variedad>,
    @InjectRepository(Cultivo)
    private readonly cultivoRepository: Repository<Cultivo>,
    @InjectRepository(CultivosXVariedad)
    private readonly cultivosXVariedadRepository: Repository<CultivosXVariedad>,
    @InjectRepository(Zona)
    private readonly zonaRepository: Repository<Zona>,
    @InjectRepository(CultivosVariedadXZona)
    private readonly cultivosVariedadXZonaRepository: Repository<CultivosVariedadXZona>,
    @InjectRepository(Actividad)
    private readonly actividadRepository: Repository<Actividad>,
    @InjectRepository(UsuarioXActividad)
    private readonly usuarioXActividadRepository: Repository<UsuarioXActividad>,
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
    @InjectRepository(Mapa)
    private readonly mapaRepository: Repository<Mapa>,
  ) {}

  async seed() {
    try {
      this.logger.log('Iniciando el proceso de seeding...', 'Seeder');

      // 1. Sincronizar Permisos Base usando tu endpoint/servicio
      await this.seedPermisos();

      // 2. Crear los tipos de unidad base
      await this.seedTiposUnidad();

      // 3. Crear bodegas y categorías base
      await this.seedBodegasYCategorias();

      // 4. Crear roles base incluyendo el rol por defecto 'INVITADO'
      const rolAdmin = await this.seedRolAdmin();
      await this.seedRolesAdicionales();

      // 5. Crear usuario admin con todos los permisos
      if (rolAdmin) {
        await this.seedUsuarioAdmin(rolAdmin);
      }

      // 6. Crear fichas de prueba
      await this.seedFichaAprendiz();

      // 6. Crear datos agrícolas de ejemplo
      console.log('=== INICIANDO SEEDING DE CULTIVOS ===');
      await this.seedTipoCultivo();
      await this.seedVariedad();
      await this.seedZona();
      await this.seedCultivo();
      await this.seedCultivosXVariedad();
      await this.seedCultivosVariedadXZona();
      await this.seedActividad();
      await this.seedUsuarioXActividad();
      console.log('=== SEEDING DE CULTIVOS COMPLETADO ===');

      // 7. Crear datos de inventario de ejemplo
      await this.seedInventario();

      this.logger.log('Seeding completado exitosamente.', 'Seeder');
    } catch (error) {
      this.logger.error('Error durante el proceso de seeding:', error.message, error.stack, 'Seeder');
      throw error; // Re-throw to let the caller know seeding failed
    }
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

  private async seedRolesAdicionales(): Promise<{ rolInstructor: Rol | null, rolAprendiz: Rol | null }> {
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

  private async seedTipoCultivo() {
    this.logger.log('Creando tipos de cultivo base...', 'Seeder');
    try {
      const tipos = ['Tomate', 'Papa', 'Maíz'];
      for (const nombre of tipos) {
        let tipo = await this.tipoCultivoRepository.findOne({ where: { nombre } });
        if (!tipo) {
          tipo = this.tipoCultivoRepository.create({ nombre });
          await this.tipoCultivoRepository.save(tipo);
          this.logger.log(`Tipo de cultivo "${nombre}" creado.`, 'Seeder');
        } else {
          this.logger.log(`Tipo de cultivo "${nombre}" ya existe.`, 'Seeder');
        }
      }
      this.logger.log('Tipos de cultivo creados/verificados.', 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando tipos de cultivo: ${error.message}`, error.stack, 'Seeder');
    }
  }

  private async seedVariedad() {
    this.logger.log('Creando variedades base...', 'Seeder');
    try {
      const variedades = [
        { nombre: 'Tomate Cherry', tipo: 'Tomate' },
        { nombre: 'Papa Criolla', tipo: 'Papa' },
        { nombre: 'Maíz Dulce', tipo: 'Maíz' },
      ];
      for (const v of variedades) {
        const tipo = await this.tipoCultivoRepository.findOne({ where: { nombre: v.tipo } });
        if (tipo) {
          let variedad = await this.variedadRepository.findOne({ where: { nombre: v.nombre } });
          if (!variedad) {
            variedad = this.variedadRepository.create({ nombre: v.nombre, fkTipoCultivoId: tipo.id });
            await this.variedadRepository.save(variedad);
            this.logger.log(`Variedad "${v.nombre}" creada.`, 'Seeder');
          } else {
            this.logger.log(`Variedad "${v.nombre}" ya existe.`, 'Seeder');
          }
        } else {
          this.logger.warn(`Tipo de cultivo "${v.tipo}" no encontrado para variedad "${v.nombre}".`, 'Seeder');
        }
      }
      this.logger.log('Variedades creadas/verificados.', 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando variedades: ${error.message}`, error.stack, 'Seeder');
    }
  }

  private async seedZona() {
    this.logger.log('Creando zonas base...', 'Seeder');
    try {
      // First, create a default mapa if it doesn't exist
      let mapa = await this.mapaRepository.findOne({ where: { nombre: 'Mapa Principal' } });
      if (!mapa) {
        mapa = this.mapaRepository.create({
          nombre: 'Mapa Principal',
          urlImg: 'https://example.com/mapa.jpg'
        });
        await this.mapaRepository.save(mapa);
        this.logger.log('Mapa principal creado.', 'Seeder');
      }

      const zonas = [
        { nombre: 'Zona Norte', tipoLote: 'Lote A', coorX: 10.5, coorY: 20.3 },
        { nombre: 'Zona Sur', tipoLote: 'Lote B', coorX: 15.7, coorY: 25.8 }
      ];

      for (const zonaData of zonas) {
        let zona = await this.zonaRepository.findOne({ where: { nombre: zonaData.nombre } });
        if (!zona) {
          zona = this.zonaRepository.create({
            nombre: zonaData.nombre,
            tipoLote: zonaData.tipoLote,
            coorX: zonaData.coorX,
            coorY: zonaData.coorY,
            fkMapaId: mapa.id
          });
          await this.zonaRepository.save(zona);
          this.logger.log(`Zona "${zonaData.nombre}" creada.`, 'Seeder');
        } else {
          this.logger.log(`Zona "${zonaData.nombre}" ya existe.`, 'Seeder');
        }
      }
      this.logger.log('Zonas creadas/verificados.', 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando zonas: ${error.message}`, error.stack, 'Seeder');
    }
  }

  private async seedCultivo() {
    this.logger.log('Creando cultivos base...', 'Seeder');
    try {
      const cultivos = [
        { siembra: new Date('2023-01-01'), estado: 1 },
        { siembra: new Date('2023-06-01'), estado: 1 },
      ];
      for (const c of cultivos) {
        const cultivo = this.cultivoRepository.create(c);
        await this.cultivoRepository.save(cultivo);
        this.logger.log(`Cultivo con siembra ${c.siembra.toISOString().split('T')[0]} creado.`, 'Seeder');
      }
      this.logger.log(`${cultivos.length} cultivos creados.`, 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando cultivos: ${error.message}`, error.stack, 'Seeder');
    }
  }

  private async seedCultivosXVariedad() {
    this.logger.log('Creando relaciones cultivos x variedad...', 'Seeder');
    try {
      const cultivos = await this.cultivoRepository.find();
      const variedades = await this.variedadRepository.find();
      this.logger.log(`Encontrados ${cultivos.length} cultivos y ${variedades.length} variedades.`, 'Seeder');

      for (let i = 0; i < Math.min(cultivos.length, variedades.length); i++) {
        const cxv = this.cultivosXVariedadRepository.create({
          fkCultivoId: cultivos[i].id,
          fkVariedadId: variedades[i].id,
        });
        await this.cultivosXVariedadRepository.save(cxv);
        this.logger.log(`Relación cultivo "${cultivos[i].id}" - variedad "${variedades[i].nombre}" creada.`, 'Seeder');
      }
      this.logger.log(`${Math.min(cultivos.length, variedades.length)} relaciones cultivo-variedad creadas.`, 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando relaciones cultivos x variedad: ${error.message}`, error.stack, 'Seeder');
    }
  }

  private async seedCultivosVariedadXZona() {
    this.logger.log('Creando relaciones cultivos variedad x zona...', 'Seeder');
    try {
      const cxvs = await this.cultivosXVariedadRepository.find();
      const zonas = await this.zonaRepository.find();
      this.logger.log(`Encontrados ${cxvs.length} cultivosXVariedad y ${zonas.length} zonas.`, 'Seeder');

      for (let i = 0; i < Math.min(cxvs.length, zonas.length); i++) {
        const cvz = this.cultivosVariedadXZonaRepository.create({
          fkCultivosXVariedadId: cxvs[i].id,
          fkZonaId: zonas[i].id,
        });
        await this.cultivosVariedadXZonaRepository.save(cvz);
        this.logger.log(`Relación CVZ creada: ${cxvs[i].id} - ${zonas[i].nombre}.`, 'Seeder');
      }
      this.logger.log(`${Math.min(cxvs.length, zonas.length)} relaciones cultivo-variedad-zona creadas.`, 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando relaciones cultivos variedad x zona: ${error.message}`, error.stack, 'Seeder');
    }
  }

  private async seedActividad() {
    this.logger.log('Creando actividades base...', 'Seeder');
    try {
      const cvzs = await this.cultivosVariedadXZonaRepository.find();
      for (const cvz of cvzs) {
        const actividad = this.actividadRepository.create({
          nombre: 'Siembra',
          descripcion: 'Actividad de siembra',
          fechaInicio: new Date('2023-01-01'),
          fechaFin: new Date('2023-01-10'),
          estado: 'en curso',
          imgUrl: 'url',
          fkCultivoVariedadZonaId: cvz.id,
        });
        await this.actividadRepository.save(actividad);
        this.logger.log(`Actividad creada.`, 'Seeder');
      }
    } catch (error) {
      this.logger.error(`Error creando actividades: ${error.message}`, 'Seeder');
    }
  }

  private async seedUsuarioXActividad() {
    this.logger.log('Creando relaciones usuario x actividad...', 'Seeder');
    try {
      const actividades = await this.actividadRepository.find();
      const usuarios = await this.usuarioRepository.find();
      for (let i = 0; i < Math.min(actividades.length, usuarios.length); i++) {
        const uxa = this.usuarioXActividadRepository.create({
          fkUsuarioId: usuarios[i].id,
          fkActividadId: actividades[i].id,
          fechaAsignacion: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        });
        await this.usuarioXActividadRepository.save(uxa);
        this.logger.log(`Relación usuario-actividad creada.`, 'Seeder');
      }
    } catch (error) {
      this.logger.error(`Error creando relaciones usuario x actividad: ${error.message}`, 'Seeder');
    }
  }

  private async seedInventario() {
    this.logger.log('Creando productos de inventario de ejemplo...', 'Seeder');
    try {
      const bodegas = await this.bodegaService.findAll();
      const categorias = await this.categoriaService.findAll();

      if (bodegas.length === 0 || categorias.length === 0) {
        this.logger.warn('No hay bodegas o categorías para crear inventario.', 'Seeder');
        return;
      }

      const productosEjemplo = [
        {
          nombre: 'Fertilizante Orgánico',
          descripcion: 'Fertilizante natural para cultivos',
          stock: 50,
          precio: 25.00,
          capacidadUnidad: 5.0,
          fechaVencimiento: '2025-12-31',
          imgUrl: 'https://example.com/fertilizante.jpg',
          fkCategoriaId: categorias[0].id,
          fkBodegaId: bodegas[0].id,
        },
        {
          nombre: 'Semillas de Tomate',
          descripcion: 'Semillas híbridas de tomate cherry',
          stock: 100,
          precio: 15.00,
          capacidadUnidad: 1.0,
          fechaVencimiento: '2026-06-30',
          imgUrl: 'https://example.com/semillas-tomate.jpg',
          fkCategoriaId: categorias[0].id,
          fkBodegaId: bodegas[0].id,
        },
        {
          nombre: 'Pesticida Natural',
          descripcion: 'Pesticida ecológico para plagas',
          stock: 30,
          precio: 35.00,
          capacidadUnidad: 2.5,
          fechaVencimiento: '2025-08-15',
          imgUrl: 'https://example.com/pesticida.jpg',
          fkCategoriaId: categorias[0].id,
          fkBodegaId: bodegas[0].id,
        },
        {
          nombre: 'Herramientas de Labranza',
          descripcion: 'Set completo de herramientas agrícolas',
          stock: 10,
          precio: 150.00,
          capacidadUnidad: 1.0,
          imgUrl: 'https://example.com/herramientas.jpg',
          fkCategoriaId: categorias[0].id,
          fkBodegaId: bodegas[0].id,
        },
      ];

      for (const producto of productosEjemplo) {
        try {
          this.logger.log(`Creando producto: ${producto.nombre}`, 'Seeder');
          // Usar el servicio de inventario para crear
          // Nota: Esto requiere que el servicio tenga un método create
          // Por ahora, creamos directamente en el repositorio
          const inventarioItem = this.inventarioRepository.create({
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            stock: producto.stock,
            precio: producto.precio,
            capacidadUnidad: producto.capacidadUnidad,
            fechaVencimiento: producto.fechaVencimiento,
            imgUrl: producto.imgUrl,
            fkCategoriaId: producto.fkCategoriaId,
            fkBodegaId: producto.fkBodegaId,
          });
          await this.inventarioRepository.save(inventarioItem);
          this.logger.log(`Producto "${producto.nombre}" creado exitosamente.`, 'Seeder');
        } catch (error) {
          this.logger.error(`Error creando producto "${producto.nombre}": ${error.message}`, error.stack, 'Seeder');
          if (error.code === '23505') { // Unique constraint violation
            this.logger.log(`Producto "${producto.nombre}" ya existe. Omitiendo.`, 'Seeder');
          } else {
            // Don't throw error, continue with other products
            this.logger.warn(`Continuando con el siguiente producto...`, 'Seeder');
          }
        }
      }

      this.logger.log('Productos de inventario de ejemplo creados.', 'Seeder');
    } catch (error) {
      this.logger.error(`Error creando productos de inventario: ${error.message}`, 'Seeder');
    }
  }
}
