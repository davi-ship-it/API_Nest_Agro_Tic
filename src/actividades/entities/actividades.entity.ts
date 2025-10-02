// File: src/entities/actividades/actividades.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CultivosVariedadXZona } from '../../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';
import { InventarioXActividad } from '../../inventario_x_actividades/entities/inventario_x_actividades.entity';
import { UsuarioXActividad } from '../../usuarios_x_actividades/entities/usuarios_x_actividades.entity';

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_actividad' })
  id: string;

  @Column({ name: 'act_nombre', type: 'varchar', length: 255 })
  nombre: string;

  @Column({ name: 'act_descripcion', type: 'text' })
  descripcion: string;

  @Column({ name: 'act_fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'act_fecha_fin', type: 'date', nullable: true })
  fechaFin?: Date;

  @Column({ name: 'act_estado', type: 'varchar', length: 10, nullable: true })
  estado?: string;

  @Column({ name: 'act_img_url', type: 'varchar', length: 255 })
  imgUrl: string;

  @Column({ name: 'fk_id_cultivo_variedad_x_zona' })
  fkCultivoVariedadZonaId: string;

  @ManyToOne(() => CultivosVariedadXZona, (cvz) => cvz.actividades)
  @JoinColumn({ name: 'fk_id_cultivo_variedad_x_zona' })
  cultivoVariedadZona?: CultivosVariedadXZona;

  @OneToMany(() => InventarioXActividad, (ixa) => ixa.actividad)
  inventarioUsado?: InventarioXActividad[];

  @OneToMany(() => UsuarioXActividad, (uxa) => uxa.actividad)
  usuariosAsignados?: UsuarioXActividad[];
}
