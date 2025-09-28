// File: src/recursos/entities/recurso.entity.ts
import { Permiso } from '../../permisos/entities/permiso.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Modulo } from '../../modulos/entities/modulo.entity';
import { Ficha } from '../../fichas/entities/ficha.entity'; // ✅ import Ficha

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

  @ManyToOne(() => Modulo, (modulo) => modulo.recursos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'fk_id_modulo' })
  modulo: Modulo;

  // ✅ Nueva relación: muchos recursos pertenecen a una ficha
  @ManyToOne(() => Ficha, (ficha) => ficha.recursos, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'fk_id_ficha' })
  ficha: Ficha;
}
