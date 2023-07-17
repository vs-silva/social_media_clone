import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";

export interface  UserServiceWriterDrivenPorts {
    register(dto: RequestUserRegisterDTO,  resource:string): Promise<ResponseUserRegisterDTO | null>;
}
