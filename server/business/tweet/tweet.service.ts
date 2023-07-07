import type {TweetServiceDriverPorts} from "./ports/tweet-service-driver.ports";
import type {TweetServiceWriterDrivenPorts} from "./ports/tweet-service-writer-driven.ports";
import type {RequestTweetCreateDTO} from "./core/dtos/request-tweet-create.dto";
import type {TweetDTO} from "./core/dtos/tweet.dto";

export function TweetService(writer: TweetServiceWriterDrivenPorts): TweetServiceDriverPorts {

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
          userId: entity.authorId
        };
    }

    return {
      createTweet
    };
}
