import type {RequestTokenSignDTO} from "../core/dtos/request-token-sign.dto";
import type {TokenSignEntity} from "../core/entities/token-sign.entity";
import type {RequestTokenVerifyDTO} from "../core/dtos/request-token-verify.dto";
import type {TokenVerifyEntity} from "../core/entities/token-verify.entity";

export interface TokenServiceEngineDrivenPorts {
    sign(dto: RequestTokenSignDTO): Promise<TokenSignEntity | null>;
    verify(dto: RequestTokenVerifyDTO): Promise<TokenVerifyEntity | null>;
}
