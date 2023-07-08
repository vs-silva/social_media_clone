import {
    defineEventHandler,
    H3Event,
    sendError,
    createError,
    RequestHeaders,
    getRequestHeaders,
    getRequestURL
} from "h3";
import UrlPatternEngine from "../../../engines/url-pattern-engine";
import Token from "../../../business/token";
import Settings from "../../../settings";
import User from "../../../business/user";
import type {ResponseUserAuthDTO} from "../../../business/user/core/dtos/response-user-auth.dto";

export default defineEventHandler(async (event: H3Event) => {

    const requestedURL = getRequestURL(event);
    const endpoints = [requestedURL.pathname];
    const headers: RequestHeaders = getRequestHeaders(event);

    const isEndpointPatternHandled = endpoints.some((endpoint: string) => {
        const pattern = new UrlPatternEngine(endpoint);
        return pattern.match(requestedURL.pathname);
    });

    if(!isEndpointPatternHandled) {
        return;
    }

    const authorizationToken = headers['authorization']?.split(' ');

    if(!authorizationToken || !authorizationToken.length) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        }));
    }

    const accessToken = authorizationToken[authorizationToken.length-1];

    const tokenDTO = await Token.verifyToken({
        token: accessToken,
        tokenSecret: Settings.accessTokenSecret as string
    });

    if(!tokenDTO || !tokenDTO.isValid) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        }));
    }

    const userDTO = await User.getUserById(tokenDTO?.userId as string);

    if(!userDTO) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Unauthorized',
        }));
    }

    return <ResponseUserAuthDTO>{
        id: userDTO.id,
        username: userDTO.username,
        email: userDTO.email,
        profileImage: userDTO.profileImage,
        profileCreateDate: userDTO.profileCreateDate,
        profileLastUpdateDate: userDTO.profileLastUpdateDate,
        accessToken: userDTO.accessToken
    };

});
