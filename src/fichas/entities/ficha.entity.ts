import { Roles } from '../../roles/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('fichas')
export class Ficha {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_ficha' })
  id: string;

  @Column({ name: 'ficha_numero', type: 'integer', unique: true })
  numero: number;

  @ManyToMany(() => Roles, (rol) => rol.fichas)
  @JoinTable({
    name: 'roles_ficha',
    joinColumn: {
      name: 'ficha_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
  })
  roles: Roles[];
}

