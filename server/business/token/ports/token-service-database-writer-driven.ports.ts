import type {TokenEntity} from "../core/entities/token.entity";
import type {RequestTokenRegisterDTO} from "../core/dtos/request-token-register.dto";

export interface TokenServiceDatabaseWriterDrivenPorts {
    save(dto: RequestTokenRegisterDTO): Promise<TokenEntity | null>;
}
