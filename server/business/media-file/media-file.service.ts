import type {MediaFileServiceDriverPorts} from "./ports/media-file-service-driver.ports";
import type {MediaFileServiceEngineDrivenPorts} from "./ports/media-file-service-engine-driven.ports";
import type {MediaFileServiceWriterDrivenPorts} from "./ports/media-file-service-writer-driven.ports";
import type {MediaFileServiceReaderDrivenPorts} from "./ports/media-file-service-reader-driven.ports";
import type {MediaFileCloudDTO} from "./core/dtos/media-file-cloud.dto";
import type {RequestMediaFileCreateDTO} from "./core/dtos/request-media-file-create.dto";
import type {MediaFileDTO} from "./core/dtos/media-file.dto";


export function MediaFileService(engine: MediaFileServiceEngineDrivenPorts, writer: MediaFileServiceWriterDrivenPorts, reader: MediaFileServiceReaderDrivenPorts): MediaFileServiceDriverPorts {

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

    async function createMediaFile(dto: RequestMediaFileCreateDTO): Promise<MediaFileDTO | null> {

        if(!dto.userId.trim() || !dto.tweetId.trim() || !dto.url.trim() || !dto.providerPublicId.trim()) {
           return null;
        }

        const entity = await writer.save(dto);

        if(!entity) {
            return null;
        }

        return <MediaFileDTO>{
            id: entity.id,
            userId: entity.userId,
            url: entity.url,
            providerPublicId: entity.providerPublicId,
            createAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            tweetId: entity.tweetId
        };
    }

    async function getMediaFileByTweetId(tweetId: string): Promise<MediaFileDTO | null> {

        const entity = await reader.getBy(() => ({tweetId: tweetId}));

        if(!entity) {
            return null;
        }

        return <MediaFileDTO>{
            id: entity.id,
            userId: entity.userId,
            url: entity.url,
            providerPublicId: entity.providerPublicId,
            createAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            tweetId: entity.tweetId
        };

    }

    return {
      uploadMediaFile,
      createMediaFile,
      getMediaFileByTweetId
    };
}
