import type {ResponseTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-create.dto";
import type {RequestTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/request-tweet-create.dto";

export interface TweetServiceDriverPorts {
    submitTweet(dto: RequestTweetCreateDTO): Promise< ResponseTweetCreateDTO| null>;
}
