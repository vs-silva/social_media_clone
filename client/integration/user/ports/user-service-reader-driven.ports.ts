import type {ResponseTokenRefreshDTO} from "../../../../server/business/token/core/dtos/response-token-refresh.dto";

export interface UserServiceReaderDrivenPorts {
    refresh(resource:string):Promise<ResponseTokenRefreshDTO | null>;
}
