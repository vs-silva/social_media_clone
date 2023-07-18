import type {UserServiceDecodeTokenDTO} from "../core/dtos/user-service-decode-token.dto";

export interface UserServiceCryptographerDrivenPorts {
    decode(token: string): Promise<UserServiceDecodeTokenDTO | null>;
}
