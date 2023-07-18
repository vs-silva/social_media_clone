import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../../server/business/user/core/dtos/response-user-auth.dto";
import type {ResponseTokenRefreshDTO} from "../../../../server/business/token/core/dtos/response-token-refresh.dto";
import type {UserServiceDecodeAccessTokenDTO} from "../core/dtos/user-service-decode-access-token.dto";

export interface UserServiceDriverPort {
    signup(dto: RequestUserRegisterDTO): Promise<ResponseUserRegisterDTO | null>;
    login(dto: RequestUserAuthDTO): Promise<ResponseUserAuthDTO | null>;
    refreshToken(accessToken: string): Promise<ResponseTokenRefreshDTO | null>;
    getUser(accessToken: string): Promise<ResponseUserAuthDTO | null>;
    decodeAccessToken(accessToken: string): Promise<UserServiceDecodeAccessTokenDTO | null>;
}
