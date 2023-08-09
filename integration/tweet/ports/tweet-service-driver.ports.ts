import type {ResponseTweetDTO} from "../../../server/business/tweet/core/dtos/response-tweet-dto";
import type {RequestTweetCreateDTO} from "../../../server/business/tweet/core/dtos/request-tweet-create.dto";

export interface TweetServiceDriverPorts {
    submitTweet(dto: RequestTweetCreateDTO): Promise< ResponseTweetDTO| null>;
    getAllTweets(): Promise<ResponseTweetDTO[] | null>;
}
