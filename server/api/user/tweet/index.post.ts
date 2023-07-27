import {createError, defineEventHandler, H3Event, parseCookies, sendError} from "h3";
import FormProcessorEngine from "../../../engines/form-processor-engine";
import {errors as FormProcessorEngineErrors} from 'formidable';
import {TweetConstants} from "../../../business/tweet/core/constants/tweet.constants";
import {MediaFileConstants} from "../../../business/media-file/core/constants/media-file.constants";
import {TokenNameConstants} from "../../../business/token/core/constants/token-name.constants";
import MediaFile from "../../../business/media-file";
import Tweet from "../../../business/tweet";
import Token from "../../../business/token";
import type {RequestMediaFileCreateDTO} from "../../../business/media-file/core/dtos/request-media-file-create.dto";
import type {RequestTweetCreateDTO} from "../../../business/tweet/core/dtos/request-tweet-create.dto";
import type {MediaFileDTO} from "../../../business/media-file/core/dtos/media-file.dto";
import type {ResponseTweetDTO} from "../../../business/tweet/core/dtos/response-tweet-dto";

export default defineEventHandler(async (event: H3Event) => {

    const cookies = parseCookies(event);
    const refreshToken = cookies[TokenNameConstants.REFRESH_TOKEN];

    if(!refreshToken) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Invalid refresh token',
        }));
    }

    const tokenDTO = await Token.getRefreshTokenByToken(refreshToken);

    if(!tokenDTO) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Invalid refresh token',
        }));
    }

    const form = FormProcessorEngine({});
    const formProcessResponse:{ fields: FormProcessorEngine.Fields, files: FormProcessorEngine.Files } = await new Promise((resolve, reject) => {

        form.parse(event.node.req, (error: typeof FormProcessorEngineErrors, fields: FormProcessorEngine.Fields, files: FormProcessorEngine.Files) => {

            if(error) {
                reject(error);
            }

            resolve({fields, files});

        });

    });

    const  tweetDTO = await Tweet.createTweet(<RequestTweetCreateDTO>{
        userId: tokenDTO.userId,
        text: formProcessResponse.fields[TweetConstants.TEXT]
    });

    if(!tweetDTO) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error.',
        }));
    }

    if(formProcessResponse.files[TweetConstants.IMAGE]) {

        let mediaFileDTO: MediaFileDTO | null = null;
        const incomingFiles = formProcessResponse.files[TweetConstants.IMAGE];

        const uploadedFiles = await Promise.all(
            Object.keys(incomingFiles).map(async (key) => {
                if (key.trim() === MediaFileConstants.FILE_PATH) {
                    const fileToUpload = Object(incomingFiles)[key];
                    return await MediaFile.uploadMediaFile(fileToUpload);
                }
            })
        );

        for (const uploadedFile of uploadedFiles) {
                if(uploadedFile) {
                    const mediaFileCloudDTO = uploadedFile;

                    mediaFileDTO = await MediaFile.createMediaFile(<RequestMediaFileCreateDTO>{
                        userId: tokenDTO.userId,
                        tweetId: tweetDTO?.id,
                        url: mediaFileCloudDTO?.url,
                        providerPublicId: mediaFileCloudDTO?.publicId
                    });

                    if(!mediaFileDTO) {
                        return sendError(event, createError({
                            statusCode: 500,
                            statusMessage: 'Internal Server Error.',
                        }));
                    }

                }
        }


        return <ResponseTweetDTO> {
            id: tweetDTO.id,
            userId: tweetDTO.userId,
            text: tweetDTO.text,
            createdAt: tweetDTO.createdAt,
            updatedAt: tweetDTO.updatedAt,
            replyToId: tweetDTO.replyToId,
            mediaId: mediaFileDTO?.id,
            mediaURL: mediaFileDTO?.url,
            mediaPublicId: mediaFileDTO?.providerPublicId
        };

    }


    return <ResponseTweetDTO> {
        id: tweetDTO.id,
        userId: tweetDTO.userId,
        text: tweetDTO.text,
        createdAt: tweetDTO.createdAt,
        updatedAt: tweetDTO.updatedAt,
        replyToId: tweetDTO.replyToId
    };

});
