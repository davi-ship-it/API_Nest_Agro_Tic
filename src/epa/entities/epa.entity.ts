// File: src/entities/epa/epa.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CultivosXEpa } from '../../cultivos_x_epa/entities/cultivos_x_epa.entity';

@Entity('epa')
export class Epa {
  @PrimaryGeneratedColumn({ name: 'pk_id_epa' })
  id: number;

  @Column({ name: 'epa_nombre', type: 'varchar', length: 100 })
  nombre: string;

  @Column({ name: 'epa_descripcion', type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'epa_img_url', type: 'varchar', length: 255, nullable: true })
  imgUrl?: string;

  @Column({ name: 'epa_tipo', type: 'varchar', length: 10 })
  tipo: string;

  @OneToMany(() => CultivosXEpa, (cxe) => cxe.epa)
  cultivosXepa?: CultivosXEpa[];
}
