import type {UserEntity} from "../core/entities/user.entity";

export interface UserServiceReaderDrivenPorts {
    getBy(expression: () => {}): Promise<UserEntity | null>;
}
