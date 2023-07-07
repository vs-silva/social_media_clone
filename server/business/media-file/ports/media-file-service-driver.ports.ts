import type {MediaFileCloudDTO} from "../core/dtos/media-file-cloud.dto";

export interface MediaFileServiceDriverPorts {
    uploadMediaFile(resourcePath: string): Promise<MediaFileCloudDTO | null>;
}
