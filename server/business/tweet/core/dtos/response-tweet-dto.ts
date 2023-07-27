import type {TweetDTO} from "./tweet.dto";
import type {TweetAuthorDTO} from "./tweet-author.dto";

export interface ResponseTweetDTO extends TweetDTO {
    mediaId?: string;
    mediaPublicId: string;
    mediaURL: string;
    author?: TweetAuthorDTO;
}
