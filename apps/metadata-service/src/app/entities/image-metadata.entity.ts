import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing extracted image metadata.
 */
@Entity()
export class ImageMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   *  FK that links this metadata to the download task.
   */
  @Column()
  downloadTaskId: string;

  /**
   *  Image format (jpeg, png, etc.)
   */
  @Column()
  format: string;

  /**
   * Image width in pixels.
   */
  @Column('int')
  width: number;

  /**
   *  Image height in pixels.
   */
  @Column('int')
  height: number;

  /**
   * Status of the extraction process.
   */
  @Column({ default: 'extracted' })
  status: string;

  /**
   *  Timestamp when the metadata was created.
   */
  @CreateDateColumn()
  createdAt: Date;
}
