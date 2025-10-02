// File: src/entities/cultivos/cultivo.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm'; // Añadir ManyToOne y JoinColumn
import { CultivosXVariedad } from '../../cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Ficha } from '../../fichas/entities/ficha.entity';

@Entity('cultivos')
export class Cultivo {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_cultivo' })
  id: string;

  @Column({ name: 'fk_id_ficha' })
  fkFichaId: string;

  @Column({ name: 'cul_estado', type: 'smallint', default: 1 })
  estado?: number;

  @Column({ name: 'cul_siembra', type: 'date', nullable: true })
  siembra?: Date;

  @OneToMany(() => CultivosXVariedad, (cxv) => cxv.cultivo)
  variedades?: CultivosXVariedad[];

  @ManyToOne(() => Ficha, (f) => f.cultivos)
  @JoinColumn({ name: 'fk_id_ficha' })
  ficha?: Ficha;
}

