import {createError, defineEventHandler, H3Event, parseCookies, sendError} from "h3";
import {TokenNameConstants} from "../../../business/token/core/constants/token-name.constants";
import User from "../../../business/user";
import Tweet from "../../../business/tweet";
import MediaFile from "../../../business/media-file";
import type {MediaFileDTO} from "../../../business/media-file/core/dtos/media-file.dto";
import type {ResponseTweetDTO} from "~/server/business/tweet/core/dtos/response-tweet-dto";

export default defineEventHandler(async (event: H3Event) => {

    const cookies = parseCookies(event);
    const refreshToken = cookies[TokenNameConstants.REFRESH_TOKEN];

    if(!refreshToken) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Invalid refresh token',
        }));
    }

    const tweets =  await Tweet.getAllTweets();

    if(!tweets) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: 'Not found!',
        }));
    }

    const userIds = new Set();
    const mediaFilePromises: Promise<MediaFileDTO | null>[] = [];

    tweets.forEach(tweet => {
        const { id, userId } = tweet;
        userIds.add(userId);
        mediaFilePromises.push(MediaFile.getMediaFileByTweetId(id as string));
    });

    const uniqueUserIds = Array.from(userIds);
    const userPromises = uniqueUserIds.map(userId => User.getUserById(userId as string));

    const [users, mediaFiles] = await Promise.all([Promise.all(userPromises), Promise.all(mediaFilePromises)]);

    return <ResponseTweetDTO[]> tweets.map((tweet, index) => {

        const { userId } = tweet;
        const author = users.find(user => user?.id === userId);

        return <ResponseTweetDTO>{
          id: tweet.id,
          userId: tweet.userId,
          text: tweet.text,
          createdAt: tweet.createdAt,
          updatedAt: tweet.updatedAt,
          replyToId: tweet.replyToId,
          mediaId: mediaFiles[index]?.id as string,
          mediaURL: mediaFiles[index]?.url as string,
          mediaPublicId: mediaFiles[index]?.providerPublicId as string,
          author: {
              id: author?.id as string,
              email: author?.email as string,
              name: author?.name as string,
              username: author?.username as string,
              profileImage: author?.profileImage as string
          }
        };
    });
});
