import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Roles } from '../../roles/entities/role.entity';
import { Cultivo } from '../../cultivos/entities/cultivo.entity';
import { Actividad } from '../../actividades/entities/actividades.entity'; // ✅ corregido
import { Recurso } from '../../recursos/entities/recurso.entity';

@Entity('fichas')
export class Ficha {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_ficha' })
  id: string;

  @Column({ name: 'ficha_numero', type: 'integer', unique: true })
  numero: number;

  @Column({ name: 'lote', type: 'varchar', length: 50 })
  lote: string;

  @Column({ name: 'fecha_siembra', type: 'date' })
  fecha_siembra: string;

  @Column({ name: 'fecha_cosecha', type: 'date', nullable: true })
  fecha_cosecha: string | null;

  @ManyToOne(() => Cultivo, (cultivo) => cultivo.fichas, { eager: true })
  cultivo: Cultivo;

  @OneToMany(() => Actividad, (actividad) => actividad.ficha, {
    cascade: true,
  })
  actividades: Actividad[];

  @OneToMany(() => Recurso, (recurso) => recurso.ficha, {
    cascade: true,
  })
  recursos: Recurso[];

  @ManyToMany(() => Roles, (rol) => rol.fichas, { eager: true })
  @JoinTable({
    name: 'roles_ficha',
    joinColumn: {
      name: 'ficha_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'rol_id',
      referencedColumnName: 'id',
    },
  })
  roles: Roles[];
}


