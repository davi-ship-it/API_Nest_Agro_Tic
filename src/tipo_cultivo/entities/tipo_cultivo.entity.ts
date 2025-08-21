// -----------------------------
// File: src/entities/tipo-cultivo/tipo-cultivo.entity.ts
// -----------------------------
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Variedad } from '../../variedad/entities/variedad.entity';

@Entity('tipo_cultivo')
export class TipoCultivo {
  @PrimaryGeneratedColumn({ name: 'pk_id_tipo_cultivo' })
  id: number;

  @Column({ name: 'tpc_nombre', type: 'varchar', length: 50 })
  nombre: string;

  @OneToMany(() => Variedad, (v) => v.tipoCultivo)
  variedades?: Variedad[];
}
