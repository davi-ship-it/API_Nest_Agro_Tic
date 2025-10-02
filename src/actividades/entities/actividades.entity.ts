import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { CultivosVariedadXZona } from '../../cultivos_variedad_x_zona/entities/cultivos_variedad_x_zona.entity';
import { UsuarioXActividad } from '../../usuarios_x_actividades/entities/usuarios_x_actividades.entity';
import { InventarioXActividad } from '../../inventario_x_actividades/entities/inventario_x_actividades.entity';

@Entity('actividades')
export class Actividad {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_actividad' })
  id: string;

  @Column({ name: 'act_descripcion', type: 'text' })
  descripcion: string;

  @Column({ name: 'act_categoria', type: 'varchar', length: 100, nullable: true })
  categoria?: string;

  @Column({ name: 'act_dni_usuario', type: 'varchar', length: 20 })
  dniUsuario: string;

  @Column({ name: 'act_nombre_inventario', type: 'varchar', length: 100, nullable: true })
  nombreInventario?: string;

  @Column({ name: 'act_fecha_inicio', type: 'date' })
  fechaInicio: Date;

  @Column({ name: 'act_nombre_zona', type: 'varchar', length: 100, nullable: true })
  nombreZona?: string;

  @Column({ name: 'fk_id_cultivo_variedad_x_zona', type: 'uuid' })
  fkCultivoVariedadZonaId: string;

  @ManyToOne(() => CultivosVariedadXZona, (cvz) => cvz.actividades)
  @JoinColumn({ name: 'fk_id_cultivo_variedad_x_zona' })
  cultivoVariedadZona?: CultivosVariedadXZona;

  @OneToMany(() => UsuarioXActividad, (uxa) => uxa.actividad)
  usuariosAsignados?: UsuarioXActividad[];

  @OneToMany(() => InventarioXActividad, (ixa) => ixa.actividad)
  inventarioUsado?: InventarioXActividad[];
}
