// File: src/entities/cultivos/cultivo.entity.ts
<<<<<<< HEAD
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
=======
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm'; // Añadir ManyToOne y JoinColumn
>>>>>>> b104bf1c376b7a9654786d3b5ee60243f4e8529a
import { CultivosXVariedad } from '../../cultivos_x_variedad/entities/cultivos_x_variedad.entity';

@Entity('cultivos')
export class Cultivo {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_cultivo' })
  id: string;

  @Column({ name: 'cul_estado', type: 'smallint', default: 1 })
  estado?: number;

  @Column({ name: 'cul_siembra', type: 'date', nullable: true })
  siembra?: Date;

  @OneToMany(() => CultivosXVariedad, (cxv) => cxv.cultivo)
  variedades?: CultivosXVariedad[];
}
