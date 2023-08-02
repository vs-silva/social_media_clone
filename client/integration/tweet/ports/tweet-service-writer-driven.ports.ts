import type {ResponseTweetDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-dto";

export interface TweetServiceWriterDrivenPorts {
    postTweet(dto: FormData, resource: string): Promise<ResponseTweetDTO | null>;
}
