import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { Permiso } from './entities/permiso.entity';
import { Recurso } from '../recursos/entities/recurso.entity';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisosRepository: Repository<Permiso>,
    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,
  ) {}

  /**
   * Sincroniza los permisos para un recurso específico.
   * Crea los permisos que no existen y elimina los que ya no se necesitan.
   * @param createPermisoDto - DTO con el nombre del recurso y la lista de acciones deseadas.
   * @returns La lista final de permisos para el recurso.
   */
  async sincronizarPermisos(createPermisoDto: CreatePermisoDto): Promise<Permiso[]> {
    const { recurso: nombreRecurso, acciones } = createPermisoDto;

    // 1. Busca o crea la entidad Recurso.
    let recurso = await this.recursoRepository.findOneBy({ nombre: nombreRecurso });
    if (!recurso) {
      recurso = this.recursoRepository.create({ nombre: nombreRecurso });
      await this.recursoRepository.save(recurso);
    }

    // 2. Obtiene todos los permisos que existen actualmente para ese recurso.
    const permisosActuales = await this.permisosRepository.find({
      where: { recurso: { id: recurso.id } },
    });
    const accionesActuales = permisosActuales.map((p) => p.accion);

    // 3. Compara y determina qué acciones crear y qué permisos eliminar.
    const accionesACrear = acciones.filter((a) => !accionesActuales.includes(a));
    const permisosAEliminar = permisosActuales.filter((p) => !acciones.includes(p.accion));

    // 4. Ejecuta las operaciones en la base de datos.
    if (permisosAEliminar.length > 0) {
      await this.permisosRepository.remove(permisosAEliminar);
    }

    if (accionesACrear.length > 0) {
      const nuevosPermisos = accionesACrear.map((accion) =>
        this.permisosRepository.create({ accion, recurso }),
      );
      await this.permisosRepository.save(nuevosPermisos);
    }

    // 5. Devuelve el estado final de los permisos para ese recurso.
    return this.permisosRepository.find({
      where: { recurso: { id: recurso.id } },
      order: { accion: 'ASC' },
    });
  }

  /**
   * Obtiene todos los permisos existentes, agrupados por recurso.
   */
  async findAll(): Promise<any[]> {
    const todosLosPermisos = await this.permisosRepository.find({
      relations: ['recurso'],
      order: { recurso: { nombre: 'ASC' }, accion: 'ASC' },
    });

    // Agrupa los permisos para una mejor visualización.
    const agrupados = todosLosPermisos.reduce((acc, permiso) => {
      const nombreRecurso = permiso.recurso.nombre;
      if (!acc[nombreRecurso]) {
        acc[nombreRecurso] = { recurso: nombreRecurso, acciones: [] };
      }
      acc[nombreRecurso].acciones.push(permiso.accion);
      return acc;
    }, {});

    return Object.values(agrupados);
  }

  /**
   * Busca los permisos para un recurso específico por su ID.
   * @param recursoId - El UUID del recurso.
   */
  async findByRecurso(recursoId: string): Promise<Permiso[]> {
    const recurso = await this.recursoRepository.findOneBy({ id: recursoId });
    if (!recurso) {
      throw new NotFoundException(`Recurso con ID "${recursoId}" no encontrado.`);
    }

    return this.permisosRepository.find({
      where: { recurso: { id: recursoId } },
    });
  }
}
