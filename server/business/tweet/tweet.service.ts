import type {TweetServiceDriverPorts} from "./ports/tweet-service-driver.ports";
import type {TweetServiceWriterDrivenPorts} from "./ports/tweet-service-writer-driven.ports";
import type {TweetServiceReaderDrivenPorts} from "./ports/tweet-service-reader-driven.ports";
import type {RequestTweetCreateDTO} from "./core/dtos/request-tweet-create.dto";
import type {TweetDTO} from "./core/dtos/tweet.dto";


export function TweetService(writer: TweetServiceWriterDrivenPorts, reader: TweetServiceReaderDrivenPorts): TweetServiceDriverPorts {

    async function createTweet(dto: RequestTweetCreateDTO): Promise<TweetDTO | null> {

        if(!dto.userId.trim() || !dto.text.trim()) {
            return null;
        }

        const entity = await writer.save(dto);

        if(!entity) {
            return null;
        }

        return <TweetDTO> {
          id: entity.id,
          text: entity.text,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
          userId: entity.authorId,
          replyToId: entity.replyToId
        };
    }

    async function  getAllTweets(): Promise<TweetDTO[] | null> {

        const entities = await reader.getAll();

        if(!entities) {
            return null;
        }

        return <TweetDTO[]>entities.map(entity => ({
            id: entity.id,
            text: entity.text,
            createdAt: entity.createdAt,
            updatedAt: entity.updatedAt,
            userId: entity.authorId,
            replyToId: entity.replyToId
        }));

    }

    return {
      createTweet,
      getAllTweets
    };
}
