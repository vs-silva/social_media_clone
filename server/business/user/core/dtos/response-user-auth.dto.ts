import type {ResponseUserRegisterDTO} from "./response-user-register.dto";

export interface ResponseUserAuthDTO extends ResponseUserRegisterDTO {
    accessToken: string;
}
