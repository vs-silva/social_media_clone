import type {TweetEntity} from "../core/entities/tweet.entity";

export interface TweetServiceReaderDrivenPorts {
    getAll(): Promise<TweetEntity[] | null>;
}
