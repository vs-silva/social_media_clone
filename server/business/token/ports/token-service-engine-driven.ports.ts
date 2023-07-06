import type {RequestTokenSignDTO} from "../core/dtos/request-token-sign.dto";
import type {TokenSignEntity} from "../core/entities/token-sign.entity";

export interface TokenServiceEngineDrivenPorts {
    sign(dto: RequestTokenSignDTO): Promise<TokenSignEntity | null>;
}
