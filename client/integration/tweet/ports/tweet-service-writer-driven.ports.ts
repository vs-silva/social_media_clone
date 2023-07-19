import type {ResponseTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-create.dto";

export interface TweetServiceWriterDrivenPorts {
    postTweet(dto: FormData, resource: string): Promise<ResponseTweetCreateDTO | null>;
}
