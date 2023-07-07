import type {MediaFileServiceDriverPorts} from "./ports/media-file-service-driver.ports";
import type {MediaFileServiceEngineDrivenPorts} from "./ports/media-file-service-engine-driven.ports";
import type {MediaFileCloudDTO} from "./core/dtos/media-file-cloud.dto";

export function MediaFileService(engine: MediaFileServiceEngineDrivenPorts): MediaFileServiceDriverPorts {

    async function uploadMediaFile(resourcePath: string): Promise<MediaFileCloudDTO | null> {

        if(!resourcePath.trim()) {
            return null;
        }

        const entity = await engine.upload(resourcePath);

        if(!entity)  {
            return null;
        }

        return <MediaFileCloudDTO> {
            id: entity.id,
            publicId: entity.publicId,
            url: entity.url,
            resourceType: entity.resourceType,
            format: entity.format,
            height: entity.height,
            width: entity.width,
            createdAt: entity.createdAt
        };
    }

    return {
      uploadMediaFile
    };
}
