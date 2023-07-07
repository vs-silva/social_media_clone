export interface RequestTweetCreateDTO {
    userId: string;
    text: string;
    mediaFiles?: File[];
}
