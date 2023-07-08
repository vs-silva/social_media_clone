import {createError, defineEventHandler, H3Event, readBody, sendError, setCookie} from "h3";
import type {RequestUserAuthDTO} from "../../../business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../business/user/core/dtos/response-user-auth.dto";
import {TokenNameConstants} from "../../../business/token/core/constants/token-name.constants";
import {RequestUserAuthDTOSchema} from "./validation/request-user-auth-dto.schema";
import User from "../../../business/user";
import Settings from "../../../settings";

export default defineEventHandler(async (event: H3Event) => {

    const body = await readBody(event);

    try {

        const validationResult = await RequestUserAuthDTOSchema.validateAsync(body);

        const userDTO = await User.authenticateUser(<RequestUserAuthDTO>{
            username: validationResult.username,
            password: validationResult.password,
            accessTokenSecret: Settings.accessTokenSecret,
            refreshTokenSecret: Settings.refreshTokenSecret
        });

        if(!userDTO) {
            return sendError(event, createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            }));
        }

        setCookie(event, TokenNameConstants.REFRESH_TOKEN, userDTO.refreshToken as string,{
            httpOnly: true,
            sameSite: true
        });

        return <ResponseUserAuthDTO>{
            id: userDTO.id,
            username: userDTO.username,
            email: userDTO.email,
            profileImage: userDTO.profileImage,
            profileCreateDate: userDTO.profileCreateDate,
            profileLastUpdateDate: userDTO.profileLastUpdateDate,
            accessToken: userDTO.accessToken
        };

    } catch (error) {
        return sendError(event, createError( {
            statusCode: 400,
            statusMessage: 'Invalid request parameters',
        }));
    }

});
