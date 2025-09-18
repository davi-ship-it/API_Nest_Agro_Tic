// File: src/entities/cosechas/cosechas.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CultivosXVariedad } from '../../cultivos_x_variedad/entities/cultivos_x_variedad.entity';
import { Venta } from '../../venta/entities/venta.entity';

@Entity('cosechas')
export class Cosecha {
  @PrimaryGeneratedColumn('uuid',{name: 'pk_id_cosecha' })
  id: string;

  @Column({ name: 'cos_unidad_medida', type: 'varchar', length: 2 })
  unidadMedida: string;

  @Column({ name: 'cos_cantidad', type: 'numeric', precision: 10, scale: 2 })
  cantidad: number;

  @Column({ name: 'cos_fecha', type: 'date', nullable: true })
  fecha?: string;

  @Column({ name: 'fk_id_cultivos_x_variedad' })
  fkCultivosXVariedadId: number;

  @ManyToOne(() => CultivosXVariedad, (cxv) => cxv.cosechas)
  @JoinColumn({ name: 'fk_id_cultivos_x_variedad' })
  cultivosXVariedad?: CultivosXVariedad;

  @OneToMany(() => Venta, (v) => v.cosecha)
  ventas?: Venta[];
}

