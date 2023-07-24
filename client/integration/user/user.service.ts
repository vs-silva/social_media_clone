import type {UserServiceDriverPort} from "./ports/user-service-driver.port";
import type {UserServiceWriterDrivenPorts} from "./ports/user-service-writer-driven.ports";
import type {UserServiceReaderDrivenPorts} from "./ports/user-service-reader-driven.ports";
import type {UserServiceCryptographerDrivenPorts} from "./ports/user-service-cryptographer-driven.ports";
import {UserServiceResourceConstants} from "./core/constants/user-service-resource.constants";
import type {ResponseUserRegisterDTO} from "../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseTokenRefreshDTO} from "../../../server/business/token/core/dtos/response-token-refresh.dto";
import type {UserServiceDecodeAccessTokenDTO} from "./core/dtos/user-service-decode-access-token.dto";


export function UserService(writer: UserServiceWriterDrivenPorts, reader: UserServiceReaderDrivenPorts, cryptographer: UserServiceCryptographerDrivenPorts):UserServiceDriverPort {

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

    async function refreshToken(): Promise<ResponseTokenRefreshDTO | null> {

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

    async function decodeAccessToken(accessToken: string): Promise<UserServiceDecodeAccessTokenDTO | null> {

        if(!tokenRegex.test(accessToken)) {
            return null;
        }

        const result = await cryptographer.decode(accessToken);

        if(!result) {
            return null;
        }

        return <UserServiceDecodeAccessTokenDTO>{
            userId: result.userId,
            issuedAt: result.iat,
            expiresAt: result.exp,
            renewCountTimer: (result.exp - 60000)
        };
    }

    return {
        signup,
        login,
        refreshToken,
        getUser,
        decodeAccessToken
    };
}
