import {MediaFileServiceWriterDrivenPorts} from "../ports/media-file-service-writer-driven.ports";
import type {MediaFileEntity} from "../core/entities/media-file.entity";
import type {RequestMediaFileCreateDTO} from "../core/dtos/request-media-file-create.dto";
import DataProvider from "../../../engines/data-provider";
import {MediaFile} from "@prisma/client";

export function MediaFileServiceDatabaseWriterAdapter(): MediaFileServiceWriterDrivenPorts {

    const engine = DataProvider;
    async function save(dto: RequestMediaFileCreateDTO): Promise<MediaFileEntity | null> {

        try {

            const dbEntity: MediaFile = await engine.mediaFile.create({
                data: dto
            });

            return <MediaFileEntity>{
                id: dbEntity.id,
                userId: dbEntity.userId,
                createdAt: dbEntity.createdAt,
                updatedAt: dbEntity.updatedAt,
                url: dbEntity.url,
                providerPublicId: dbEntity.providerPublicId,
                tweetId: dbEntity.tweetId
            };

        } catch (error) {
            return null;
        }

    }

    return {
        save
    };
}
