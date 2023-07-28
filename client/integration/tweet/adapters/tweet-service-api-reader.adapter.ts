import type {TweetServiceReaderDrivenPorts} from "../ports/tweet-service-reader-driven.ports";
import type {ResponseTweetDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-dto";
import {AxiosInstance} from "axios";
import {ApiEngine} from "../../../engines/api-engine";
import {ApiEngineConfigDTO} from "../../../engines/api-engine/api-engine-config.dto";
import EventbusEngine from "../../../engines/eventbus-engine";
import {TweetServiceResourceConstants} from "../core/constants/tweet-service-resource.constants";
import {TweetServiceEventTypeConstants} from "../core/constants/tweet-service-event-type.constants";

export function TweetServiceApiReaderAdapter(): TweetServiceReaderDrivenPorts {

    const engine: AxiosInstance = ApiEngine(<ApiEngineConfigDTO>{
        baseURL: TweetServiceResourceConstants.ROOT,
        startedServiceRequestEvent: TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_STARTED,
        endedServiceRequestEvent: TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_ENDED,
        errorServiceRequestEvent: TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_FAILED
    }, EventbusEngine);

    async function getAll(resource: string): Promise<ResponseTweetDTO[] | null> {

        try {

            const response = await engine.get(resource);
            return response.data as ResponseTweetDTO[];

        } catch (error) {
            return null;
        }

    }

    return {
      getAll
    };
}
