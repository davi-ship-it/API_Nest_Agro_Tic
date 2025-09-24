import { Usuario } from '../../usuarios/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
} from 'typeorm';

@Entity('fichas')
export class Ficha {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_ficha' })
  id: string;

  @Column({ name: 'ficha_numero', type: 'integer', unique: true })
  numero: number;

  @ManyToMany(() => Usuario, (usuario) => usuario.fichas)
  usuarios: Usuario[];
}

