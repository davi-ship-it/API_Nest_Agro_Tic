// File: src/entities/mapas/mapas.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Zona } from '../../zonas/entities/zona.entity';

@Entity('mapas')
export class Mapa {
  @PrimaryGeneratedColumn({ name: 'pk_id_mapa' })
  id: number;

  @Column({ name: 'map_url_img', type: 'varchar', length: 255 })
  urlImg: string;

  @OneToMany(() => Zona, (z) => z.mapa)
  zonas?: Zona[];
}
