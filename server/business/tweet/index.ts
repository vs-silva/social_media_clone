import {TweetService} from "./tweet.service";
import {TweetServiceDatabaseWriterAdapter} from "./adapters/tweet-service-database-writer.adapter";
import {TweetServiceDatabaseReaderAdapter} from "./adapters/tweet-service-database-reader.adapter";

export default TweetService(TweetServiceDatabaseWriterAdapter(), TweetServiceDatabaseReaderAdapter());
