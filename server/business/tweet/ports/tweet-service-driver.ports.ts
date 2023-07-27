import type {RequestTweetCreateDTO} from "../core/dtos/request-tweet-create.dto";
import type {TweetDTO} from "../core/dtos/tweet.dto";

export interface TweetServiceDriverPorts {
    createTweet(dto: RequestTweetCreateDTO): Promise<TweetDTO | null>;
    getAllTweets():Promise<TweetDTO[] | null>;
}
