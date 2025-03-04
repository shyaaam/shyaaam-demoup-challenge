/**
 * DTO for image metadata.
 */
export class ImageMetadataDto {
    /** ID of the download task */
    taskId: string = '';
    /** Image format (jpeg, png, etc.) */
    format: string = '';
    /** Image width in pixels */
    width: number = 0;
    /** Image height in pixels */
    height: number = 0;
    /** Extraction status */
    status: string = '';
  }
  