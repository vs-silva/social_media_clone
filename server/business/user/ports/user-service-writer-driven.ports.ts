import type {UserDTO} from "../core/dtos/user.dto";
import type {UserEntity} from "../core/entities/user.entity";

export interface UserServiceWriterDrivenPorts {
    save(dto: UserDTO): Promise<UserEntity | null>;
}
