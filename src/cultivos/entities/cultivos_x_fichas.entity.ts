// File: src/cultivos/entities/cultivos_x_fichas.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cultivo } from './cultivo.entity';
import { Ficha } from '../../fichas/entities/ficha.entity';

@Entity('cultivos_x_fichas')
export class CultivosXFichas {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_cultivo_ficha' })
  id: string;

  @Column({ name: 'fk_id_cultivo' })
  fkCultivoId: string;

  @Column({ name: 'fk_id_ficha' })
  fkFichaId: string;

  @ManyToOne(() => Cultivo, (c) => c.cultivosXFichas)
  @JoinColumn({ name: 'fk_id_cultivo' })
  cultivo?: Cultivo;

  @ManyToOne(() => Ficha, (f) => f.cultivosXFichas)
  @JoinColumn({ name: 'fk_id_ficha' })
  ficha?: Ficha;
}