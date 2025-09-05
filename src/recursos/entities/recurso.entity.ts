import { Permiso } from '../../permisos/entities/permiso.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';

@Entity('recursos')
@Unique(['nombre']) // Asegura que no haya recursos con el mismo nombre
export class Recurso {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_recurso' })
  id: string;

  @Column({
    name: 'recurso_nombre',
    type: 'varchar',
    length: 100,
  })
  nombre: string; // Ejemplo: 'usuarios', 'productos', 'reportes'

  // Un recurso puede estar asociado a muchos permisos (leer usuarios, crear usuarios, etc.)
  @OneToMany(() => Permiso, (permiso) => permiso.recurso)
  permisos: Permiso[];
}