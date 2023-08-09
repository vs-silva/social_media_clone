import type {ResponseTokenRefreshDTO} from "../../../server/business/token/core/dtos/response-token-refresh.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";

export interface UserServiceReaderDrivenPorts {
    refresh(resource:string):Promise<ResponseTokenRefreshDTO | null>;
    getUserInfo(resource:string):Promise<ResponseUserAuthDTO | null>;
}
