import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

/**
 * Entity representing a download task.
 */
@Entity()
export class DownloadTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The URL provided by the client to download the image.
   */
  @Column()
  originalUrl: string;

  /**
   * Current status of the download task.
   */
  @Column({ default: 'pending' })
  status: string;

  /**
   * Timestamp when the download task was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * A JSONB column to store error details when a download task fails.
   * It can include structured information such as error message, error code, and timestamp.
   */
  @Column({ type: 'jsonb', nullable: true })
  errorDetails: any;

  /**
   * FK that links this image to its metadata.
   */
  @Column({ name: 'image_metadata_id', type: 'uuid' })
  imageMetaDataId: string;
}
