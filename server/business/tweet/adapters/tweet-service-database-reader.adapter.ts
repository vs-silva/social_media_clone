import type {TweetServiceReaderDrivenPorts} from "../ports/tweet-service-reader-driven.ports";
import type {TweetEntity} from "../core/entities/tweet.entity";
import DataProvider from "../../../engines/data-provider";
import {Tweet} from ".prisma/client";

export function TweetServiceDatabaseReaderAdapter():TweetServiceReaderDrivenPorts {

    const engine = DataProvider;

    async function getAll(): Promise<TweetEntity[] | null> {

        try {

            const dbEntities = await engine.tweet.findMany({
                orderBy: [
                    {
                        updatedAt: 'desc'
                    }
                ],
            });

            if(!dbEntities) {
                return null;
            }

            return <TweetEntity[]>dbEntities.map(dbEntity => ({
                id: dbEntity.id,
                text: dbEntity.text,
                authorId: dbEntity.authorId,
                replyToId: dbEntity.replyToId,
                createdAt: dbEntity.createdAt,
                updatedAt: dbEntity.updatedAt
            }));

        } catch (error) {
            return null;
        }

    }

    return {
        getAll
    };
}
