import type {RequestTweetCreateDTO} from "../core/dtos/request-tweet-create.dto";
import type {TweetEntity} from "../core/entities/tweet.entity";

export interface TweetServiceWriterDrivenPorts {
    save(dto: RequestTweetCreateDTO): Promise<TweetEntity | null>;
}
