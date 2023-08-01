import type {TweetServiceWriterDrivenPorts} from "../ports/tweet-service-writer-driven.ports";
import type {TweetEntity} from "../core/entities/tweet.entity";
import type {RequestTweetCreateDTO} from "../core/dtos/request-tweet-create.dto";
import DataProvider from "../../../engines/data-provider";
import {Tweet} from ".prisma/client";

export function TweetServiceDatabaseWriterAdapter(): TweetServiceWriterDrivenPorts {

    const engine = DataProvider;

    async function save(dto: RequestTweetCreateDTO): Promise<TweetEntity | null> {

        try {

            const dbEntity: Tweet = await engine.tweet.create({
                data: {
                    text: dto.text,
                    authorId: dto.userId
                }
            });

            return <TweetEntity>{
                id: dbEntity.id,
                text: dbEntity.text,
                authorId: dbEntity.authorId,
                replyToId: dbEntity.replyToId,
                createdAt: dbEntity.createdAt,
                updatedAt: dbEntity.updatedAt
            };

        } catch (error) {
            console.log(error);
            return null;
        }

    }

    return {
        save
    };
}
