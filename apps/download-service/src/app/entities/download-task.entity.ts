import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing a download task.
 */
@Entity()
export class DownloadTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalUrl: string;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  /**
   * A JSONB column to store error details when a download task fails.
   * It can include structured information such as error message, error code, and timestamp.
   */
  @Column({ type: 'jsonb', nullable: true })
  errorDetails: any;

  @Column({ name: 'image_metadata_id', type: 'uuid' })
  imageMetaDataId: string;
}
