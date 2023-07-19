import type {TweetServiceWriterDrivenPorts} from "../ports/tweet-service-writer-driven.ports";
import type {ResponseTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-create.dto";
import {AxiosInstance} from "axios";
import {ApiEngine} from "../../../engines/api-engine";
import {ApiEngineConfigDTO} from "../../../engines/api-engine/api-engine-config.dto";
import EventbusEngine from "../../../engines/eventbus-engine";
import {TweetServiceResourceConstants} from "../core/constants/tweet-service-resource.constants";
import {TweetServiceEventTypeConstants} from "../core/constants/tweet-service-event-type.constants";

export function TweetServiceApiWriterAdapter(): TweetServiceWriterDrivenPorts {

    const engine: AxiosInstance = ApiEngine(<ApiEngineConfigDTO>{
        baseURL: TweetServiceResourceConstants.ROOT,
        startedServiceRequestEvent: TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_STARTED,
        endedServiceRequestEvent: TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_ENDED,
        errorServiceRequestEvent: TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_FAILED
    }, EventbusEngine);

    async function postTweet(dto: FormData, resource: string): Promise<ResponseTweetCreateDTO | null> {

        try {
            const response = await engine.post(resource, dto, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            return response.data as ResponseTweetCreateDTO;

        } catch (error) {
            return null;
        }

    }

    return {
      postTweet
    };
}
