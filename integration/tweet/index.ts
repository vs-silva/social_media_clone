import {TweetService} from "./tweet.service";
import {TweetServiceApiWriterAdapter} from "./adapters/tweet-service-api-writer.adapter";
import {TweetServiceApiReaderAdapter} from "./adapters/tweet-service-api-reader.adapter";

export default TweetService(TweetServiceApiWriterAdapter(), TweetServiceApiReaderAdapter());
