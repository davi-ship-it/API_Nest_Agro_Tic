import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Unique } from 'typeorm';
import { Recurso } from '../../recursos/entities/recurso.entity';

@Entity('modulos')
@Unique(['nombre'])
export class Modulo {
  @PrimaryGeneratedColumn('uuid', { name: 'pk_id_modulo' })
  id: string;

  @Column({
    name: 'modulo_nombre',
    type: 'varchar',
    length: 100,
  })
  nombre: string;

  // ✅ RELACIÓN: Un módulo puede tener muchos recursos.
  @OneToMany(() => Recurso, (recurso) => recurso.modulo)
  recursos: Recurso[];
}