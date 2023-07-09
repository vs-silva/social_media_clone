import type {TweetDTO} from "./tweet.dto";

export interface ResponseTweetCreateDTO extends TweetDTO {
    mediaId?: string;
    mediaPublicId: string;
    mediaURL: string;
}
