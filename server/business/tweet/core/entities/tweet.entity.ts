export interface TweetEntity {
    id: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    replyToId: string;
}
