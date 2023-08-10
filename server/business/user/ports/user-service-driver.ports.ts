import type {RequestUserRegisterDTO} from "../core/dtos/request-user-register.dto";
import type {UserDTO} from "../core/dtos/user.dto";
import type {RequestUserAuthDTO} from "../core/dtos/request-user-auth.dto";

export interface UserServiceDriverPorts {
    registerUser(dto: RequestUserRegisterDTO): Promise<UserDTO | null>;
    authenticateUser(dto: RequestUserAuthDTO): Promise<UserDTO | null>;
    getUserById(userId: string): Promise<UserDTO | null>;
}
