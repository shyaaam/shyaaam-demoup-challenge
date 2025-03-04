import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing the public image record.
 */
@Entity()
export class PublicImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagePath: string;

  @Column()
  publicUrl: string;

  @Column({ default: 'stored' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
