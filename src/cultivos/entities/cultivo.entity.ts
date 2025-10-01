// File: src/entities/cultivos/cultivo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'; // Añadir ManyToOne y JoinColumn
import { CultivosXVariedad } from '../../cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CultivosXFichas } from './cultivos_x_fichas.entity';

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

  @OneToMany(() => CultivosXFichas, (cxf) => cxf.cultivo)
  cultivosXFichas?: CultivosXFichas[];
}

