import type {RequestTokenGenerateDTO} from "../core/dtos/request-token-generate.dto";
import type {TokenDTO} from "../core/dtos/token.dto";
import type {RequestTokenVerifyDTO} from "../core/dtos/request-token-verify.dto";
import type {ResponseTokenAccessVerifyDTO} from "../core/dtos/response-token-access-verify.dto";

export interface TokenServiceDriverPorts {
    generateTokens(dto: RequestTokenGenerateDTO): Promise<TokenDTO | null>;
    getRefreshTokenByToken(refreshToken: string): Promise<TokenDTO | null>;
    verifyToken(dto: RequestTokenVerifyDTO): Promise<TokenDTO | null>;
    verifyAccessToken(dto: RequestTokenVerifyDTO): Promise<ResponseTokenAccessVerifyDTO | null>;
}
