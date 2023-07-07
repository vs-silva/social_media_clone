import type {MediaFileCloudEntity} from "../core/entities/media-file-cloud.entity";

export interface MediaFileServiceEngineDrivenPorts {
    upload(resourcePath: string): Promise<MediaFileCloudEntity | null>;
}
