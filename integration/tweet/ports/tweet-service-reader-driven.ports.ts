import type {ResponseTweetDTO} from "../../../server/business/tweet/core/dtos/response-tweet-dto";

export interface TweetServiceReaderDrivenPorts {
    getAll(resource: string): Promise<ResponseTweetDTO[] | null>;
}
