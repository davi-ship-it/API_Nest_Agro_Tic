import { Permiso } from '../../permisos/entities/permiso.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
} from 'typeorm';

@Entity('recursos')
@Unique(['nombre'])
export class Recurso {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_recurso' })
  id: string;

  @Column({
    name: 'recurso_nombre',
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  @OneToMany(() => Permiso, (permiso) => permiso.recurso)
  permisos: Permiso[];
}