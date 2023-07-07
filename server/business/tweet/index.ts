import {TweetService} from "./tweet.service";
import {TweetServiceDatabaseWriterAdapter} from "./adapters/tweet-service-database-writer.adapter";

export default TweetService(TweetServiceDatabaseWriterAdapter());
