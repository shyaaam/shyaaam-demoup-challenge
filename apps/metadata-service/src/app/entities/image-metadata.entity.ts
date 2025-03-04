import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing extracted image metadata.
 */
@Entity()
export class ImageMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  downloadTaskId: string;

  @Column()
  format: string;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @Column({ default: 'extracted' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
