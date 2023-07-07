import type { MediaFileServiceEngineDrivenPorts} from "../ports/media-file-service-engine-driven.ports";
import type {MediaFileCloudEntity} from "../core/entities/media-file-cloud.entity";
import CloudMediaProvider from "../../../engines/cloud-media-provider";
import { UploadApiResponse } from "cloudinary"

export function MediaFileServiceCloudEngineAdapter(): MediaFileServiceEngineDrivenPorts{

    const engine = CloudMediaProvider;

    async function upload(resourcePath: string): Promise<MediaFileCloudEntity | null> {

        try {

            const cloudEntity: UploadApiResponse = await engine.uploader.upload(resourcePath);

            return <MediaFileCloudEntity> {
                id: cloudEntity.asset_id,
                createdAt: new Date(cloudEntity.created_at),
                publicId: cloudEntity.public_id,
                width: cloudEntity.width,
                height: cloudEntity.height,
                format: cloudEntity.format,
                url: cloudEntity.url,
                resourceType: cloudEntity.resource_type,
                type: cloudEntity.type,
                bytes: cloudEntity.bytes,
                secureUrl: cloudEntity.secure_url,
                version: cloudEntity.version,
                signature: cloudEntity.signature
            };

        } catch (error) {
            return null;
        }

    }

    return {
        upload
    };
}
