import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type{ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";

export interface UserServiceDriverPort {
    signup(dto: RequestUserRegisterDTO): Promise<ResponseUserRegisterDTO | null>;
}
