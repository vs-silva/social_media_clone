import type {UserServiceDriverPort} from "./ports/user-service-driver.port";
import type {UserServiceWriterDrivenPorts} from "./ports/user-service-writer-driven.ports";
import type {UserServiceReaderDrivenPorts} from "./ports/user-service-reader-driven.ports";
import {UserServiceResourceConstants} from "./core/constants/user-service-resource.constants";
import type {ResponseUserRegisterDTO} from "../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseTokenRefreshDTO} from "../../../server/business/token/core/dtos/response-token-refresh.dto";


export function UserService(writer: UserServiceWriterDrivenPorts, reader: UserServiceReaderDrivenPorts):UserServiceDriverPort {

    const tokenRegex = /^([A-Za-z0-9-_=]+\.)+([A-Za-z0-9-_=]+)+(\.[A-Za-z0-9-_.+/=]+)?$/;

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

    async function refreshToken(accessToken: string): Promise<ResponseTokenRefreshDTO | null> {

        if(!tokenRegex.test(accessToken)) {
            return null;
        }

        const result = await reader.refresh(UserServiceResourceConstants.REFRESH);

        if(!result) {
            return null;
        }

        return result;
    }

    async function getUser(accessToken: string): Promise<ResponseUserAuthDTO | null> {

        if(!tokenRegex.test(accessToken)) {
            return null;
        }

        const result = await reader.getUserInfo(UserServiceResourceConstants.USER);

        if(!result) {
            return null;
        }

        return result;

    }

    return {
        signup,
        login,
        refreshToken,
        getUser
    };
}
