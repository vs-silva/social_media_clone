import type {MediaFileServiceReaderDrivenPorts} from "../ports/media-file-service-reader-driven.ports";
import type {MediaFileEntity} from "../core/entities/media-file.entity";
import DataProvider from "../../../engines/data-provider";
import {MediaFile} from "@prisma/client";
export function MediaFileServiceDatabaseReaderAdapter(): MediaFileServiceReaderDrivenPorts {

    const engine = DataProvider;

    async function getBy(expression: () => {}): Promise<MediaFileEntity | null> {

        try {

            const dbEntities: MediaFile[] | null = await engine.mediaFile.findMany({
                where: expression()
            });

            if(!dbEntities.length) {
                return null;
            }

            const dbEntity = dbEntities[0];

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
        getBy
    }
}
