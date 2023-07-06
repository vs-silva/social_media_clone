import type {RequestTokenGenerateDTO} from "../core/dtos/request-token-generate.dto";
import type {TokenDTO} from "../core/dtos/token.dto";

export interface TokenServiceDriverPorts {
    generateTokens(dto: RequestTokenGenerateDTO): Promise<TokenDTO | null>;
}
