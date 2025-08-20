import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Area } from './Area';

@Entity('processes')
export class Process {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid' })
  areaId: string;

  @Column({ type: 'uuid', nullable: true })
  parentId?: string;

  @Column({ type: 'text', nullable: true })
  tools?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  responsible?: string;

  @Column({ type: 'text', nullable: true })
  documentation?: string;

  @Column({ type: 'enum', enum: ['manual', 'systemic'] })
  type: 'manual' | 'systemic';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Area, area => area.processes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'areaId' })
  area: Area;

  @ManyToOne(() => Process, process => process.children, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentId' })
  parent: Process;

  @OneToMany(() => Process, process => process.parent)
  children: Process[];
} 