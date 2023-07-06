import type {RequestUserRegisterDTO} from "../core/dtos/request-user-register.dto";
import type {UserDTO} from "../core/dtos/user.dto";

export interface UserServiceDriverPorts {
    registerUser(dto: RequestUserRegisterDTO): Promise<UserDTO | null>;
}
