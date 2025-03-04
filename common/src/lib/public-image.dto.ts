/**
 * DTO for public image record.
 */
export class PublicImageDto {
    /** Unique identifier for the stored image */
    imageId: string = '';
    /** Local storage path of the image */
    imagePath: string = '';
    /** Generated public URL for image access */
    publicUrl: string = '';
    /** Storage status */
    status: string = '';
  }
  