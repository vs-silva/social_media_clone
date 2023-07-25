import {ref} from "@vue/runtime-core";
import Tweet from "../../integration/tweet";
import type {RequestTweetCreateDTO} from "../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import type {ResponseTweetCreateDTO} from "../../../server/business/tweet/core/dtos/response-tweet-create.dto";


export const TweetStoreIdentifier = 'tweet-store';

export function TweetStore() {

    const tweet = ref<ResponseTweetCreateDTO | null>(null)

    async function submitTweet(dto:  RequestTweetCreateDTO): Promise<void> {

        if(!dto.userId || !dto.text) {
            return;
        }

        tweet.value = await Tweet.submitTweet(dto);
    }

    return{
        tweet,
        submitTweet
    };
}
