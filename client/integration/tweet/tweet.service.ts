import type {TweetServiceDriverPorts} from "./ports/tweet-service-driver.ports";
import type {TweetServiceWriterDrivenPorts} from "./ports/tweet-service-writer-driven.ports";
import type {ResponseTweetDTO} from "../../../server/business/tweet/core/dtos/response-tweet-dto";
import type {RequestTweetCreateDTO} from "../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import {TweetServiceFormFieldsConstants} from "./core/constants/tweet-service-form-fields.constants";
import {TweetServiceResourceConstants} from "./core/constants/tweet-service-resource.constants";


export function TweetService(writer: TweetServiceWriterDrivenPorts): TweetServiceDriverPorts {

    const idRegex = /\b[0-9a-f]{24}\b/;

    async function submitTweet(dto: RequestTweetCreateDTO): Promise<ResponseTweetDTO | null> {

        if(!idRegex.test(dto.userId)) {
            return null;
        }

        const tweetForm = new FormData();
        tweetForm.append(TweetServiceFormFieldsConstants.TEXT, dto.text);

        if(dto.mediaFiles) {
            for (let i = 0; i < dto.mediaFiles.length; i++) {
                tweetForm.append(TweetServiceFormFieldsConstants.IMAGE, dto.mediaFiles[i]);
            }
        }

        const result = await writer.postTweet(tweetForm, TweetServiceResourceConstants.TWEET)

        if(!result) {
            return null;
        }

        return result;

    }


    return {
        submitTweet
    };
}
