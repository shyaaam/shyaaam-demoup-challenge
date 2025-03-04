import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing the public image.
 */
@Entity()
export class PublicImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Local path to the stored image file.
   */
  @Column()
  imagePath: string;

  /**
   * The URL from our system that clients can use to access/view the image.
   */
  @Column()
  publicUrl: string;

  /**
   * Current storage status
   */
  @Column({ default: 'stored' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
