export interface TweetDTO {
    id: string;
    userId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    replyToId?: string;
}
