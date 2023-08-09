import type {TweetServiceDriverPorts} from "./ports/tweet-service-driver.ports";
import type {TweetServiceWriterDrivenPorts} from "./ports/tweet-service-writer-driven.ports";
import type {TweetServiceReaderDrivenPorts} from "./ports/tweet-service-reader-driven.ports";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import type {RequestTweetCreateDTO} from "../../server/business/tweet/core/dtos/request-tweet-create.dto";
import {TweetServiceFormFieldsConstants} from "./core/constants/tweet-service-form-fields.constants";
import {TweetServiceResourceConstants} from "./core/constants/tweet-service-resource.constants";

export function TweetService(writer: TweetServiceWriterDrivenPorts, reader: TweetServiceReaderDrivenPorts): TweetServiceDriverPorts {

    async function submitTweet(dto: RequestTweetCreateDTO): Promise<ResponseTweetDTO | null> {

        const tweetForm = new FormData();
        tweetForm.append(TweetServiceFormFieldsConstants.TEXT, dto.text);

        if(dto.mediaFiles) {
            for (let i = 0; i < dto.mediaFiles.length; i++) {
                tweetForm.append(TweetServiceFormFieldsConstants.IMAGE, dto.mediaFiles[i]);
            }
        }

        return await writer.postTweet(tweetForm, TweetServiceResourceConstants.TWEET);
    }

    async function getAllTweets(): Promise<ResponseTweetDTO[] | null> {
        return await reader.getAll(TweetServiceResourceConstants.TWEET);
    }


    return {
        submitTweet,
        getAllTweets
    };
}
