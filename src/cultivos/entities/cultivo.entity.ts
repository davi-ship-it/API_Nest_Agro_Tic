// File: src/cultivos/entities/cultivo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CultivosXVariedad } from '../../cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Ficha } from '../../fichas/entities/ficha.entity'; // ✅ import Ficha

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

  // ✅ Nueva relación: un cultivo tiene muchas fichas
  @OneToMany(() => Ficha, (ficha) => ficha.cultivo)
  fichas: Ficha[];
}
