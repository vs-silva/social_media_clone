import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../../server/business/user/core/dtos/response-user-auth.dto";

export interface  UserServiceWriterDrivenPorts {
    register(dto: RequestUserRegisterDTO,  resource:string): Promise<ResponseUserRegisterDTO | null>;
    login(dto: RequestUserAuthDTO, resource:string): Promise<ResponseUserAuthDTO | null>;
}
