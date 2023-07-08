import {createError, defineEventHandler, H3Event, readBody, sendError} from "h3";
import type {RequestUserRegisterDTO} from "../../../business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../business/user/core/dtos/response-user-register.dto";
import {RequestUserRegisterDTOSchema} from "./validation/request-user-register-dto.schema";
import User from "../../../business/user";

export default defineEventHandler(async (event: H3Event) => {

    const body = await readBody(event);

    try {
        const validationResult = await RequestUserRegisterDTOSchema.validateAsync(body);
        const userDTO = await User.registerUser(validationResult as RequestUserRegisterDTO);

        if(!userDTO) {
            return sendError(event, createError({
                statusCode: 500,
                statusMessage: 'Internal Server Error',
            }));
        }

        return <ResponseUserRegisterDTO>{
            id: userDTO.id,
            username: userDTO.username,
            email: userDTO.email,
            profileImage: userDTO.profileImage,
            profileCreateDate: userDTO.profileCreateDate,
            profileLastUpdateDate: userDTO.profileLastUpdateDate
        };

    } catch (error) {
        return sendError(event, createError( {
            statusCode: 400,
            statusMessage: 'Invalid request parameters',
        }));
    }

});
