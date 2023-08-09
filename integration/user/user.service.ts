import type {UserServiceDriverPort} from "./ports/user-service-driver.port";
import type {UserServiceWriterDrivenPorts} from "./ports/user-service-writer-driven.ports";
import type {UserServiceReaderDrivenPorts} from "./ports/user-service-reader-driven.ports";
import type {UserServiceCryptographerDrivenPorts} from "./ports/user-service-cryptographer-driven.ports";
import {UserServiceResourceConstants} from "./core/constants/user-service-resource.constants";
import type {ResponseUserRegisterDTO} from "../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserAuthDTO} from "../../server/business/user/core/dtos/response-user-auth.dto";
import type {RequestUserAuthDTO} from "../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseTokenRefreshDTO} from "../../server/business/token/core/dtos/response-token-refresh.dto";
import type {UserServiceDecodeAccessTokenDTO} from "./core/dtos/user-service-decode-access-token.dto";

export function UserService(writer: UserServiceWriterDrivenPorts, reader: UserServiceReaderDrivenPorts, cryptographer: UserServiceCryptographerDrivenPorts):UserServiceDriverPort {

    async function signup(dto: RequestUserRegisterDTO): Promise<ResponseUserRegisterDTO | null> {
        return await writer.register(dto, UserServiceResourceConstants.REGISTER);
    }

    async function login(dto: RequestUserAuthDTO): Promise<ResponseUserAuthDTO | null> {
        return await writer.login(dto, UserServiceResourceConstants.LOGIN);
    }

    async function refreshToken(): Promise<ResponseTokenRefreshDTO | null> {
        return await reader.refresh(UserServiceResourceConstants.REFRESH);
    }

    async function getUser(): Promise<ResponseUserAuthDTO | null> {
        return await reader.getUserInfo(UserServiceResourceConstants.USER);
    }

    async function decodeAccessToken(accessToken: string): Promise<UserServiceDecodeAccessTokenDTO | null> {

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
