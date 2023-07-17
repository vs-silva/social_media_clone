import type {UserServiceDriverPort} from "./ports/user-service-driver.port";
import type {UserServiceWriterDrivenPorts} from "./ports/user-service-writer-driven.ports";
import type {ResponseUserRegisterDTO} from "../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";


import {UserServiceResourceConstants} from "./core/constants/user-service-resource.constants";

export function UserService(writer: UserServiceWriterDrivenPorts):UserServiceDriverPort {

    async function signup(dto: RequestUserRegisterDTO): Promise<ResponseUserRegisterDTO | null> {

        const result = await writer.register(dto, UserServiceResourceConstants.REGISTER);

        if(!result) {
            return null;
        }

        return result;
    }

    async function login(dto: RequestUserAuthDTO): Promise<ResponseUserAuthDTO | null> {

        const result = await writer.login(dto, UserServiceResourceConstants.LOGIN);

        if(!result) {
            return null;
        }

        return result;

    }

    return {
        signup,
        login
    };
}