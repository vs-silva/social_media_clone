import {createError, defineEventHandler, H3Event, parseCookies, sendError} from "h3";
import {TokenNameConstants} from "../../../business/token/core/constants/token-name.constants";
import Token from "../../../business/token";
import User from "../../../business/user";
import Settings from "../../..//settings";
import type {RequestTokenVerifyDTO} from "../../../business/token/core/dtos/request-token-verify.dto";
import type {RequestTokenGenerateDTO} from "../../../business/token/core/dtos/request-token-generate.dto";
import type {ResponseTokenRefreshDTO} from "../../../business/token/core/dtos/response-token-refresh.dto";

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

    if(!refreshToken) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Invalid refresh token',
        }));
    }

    const userDTO = await User.getUserById(tokenDTO?.userId as string);

    if(!userDTO) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Invalid refresh token',
        }));
    }

    const tokenVerificationResultDTO = await Token.verifyToken(<RequestTokenVerifyDTO>{
        token: tokenDTO?.refreshToken,
        tokenSecret: Settings.refreshTokenSecret
    });

    if(!tokenVerificationResultDTO || !tokenVerificationResultDTO.isValid) {
        return sendError(event, createError({
            statusCode: 401,
            statusMessage: 'Invalid refresh token',
        }));
    }

    const newTokenDTO = await Token.generateTokens(<RequestTokenGenerateDTO>{
        userId: tokenVerificationResultDTO.userId,
        accessTokenSecret: Settings.accessTokenSecret,
        refreshTokenSecret: Settings.refreshTokenSecret
    });

    if(!newTokenDTO) {
        return sendError(event, createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error.',
        }));
    }

    return <ResponseTokenRefreshDTO>{
      userId: newTokenDTO.userId,
      accessToken: newTokenDTO.accessToken
    };

});
