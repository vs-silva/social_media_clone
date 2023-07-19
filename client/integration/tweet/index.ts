import {TweetService} from "./tweet.service";
import {TweetServiceApiWriterAdapter} from "./adapters/tweet-service-api-writer.adapter";

export default TweetService(TweetServiceApiWriterAdapter());
