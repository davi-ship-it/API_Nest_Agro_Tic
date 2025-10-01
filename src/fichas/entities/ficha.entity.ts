import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { CultivosXFichas } from '../../cultivos/entities/cultivos_x_fichas.entity';

@Entity('fichas')
export class Ficha {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_ficha' })
  id: string;

  @Column({ name: 'ficha_numero', type: 'bigint', unique: true })
  numero: number;

  @OneToMany(() => Usuario, (usuario) => usuario.ficha)
  usuarios?: Usuario[];

  @OneToMany(() => CultivosXFichas, (cxf) => cxf.ficha)
  cultivosXFichas?: CultivosXFichas[];
}

