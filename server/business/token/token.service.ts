import type {TokenServiceDriverPorts} from "./ports/token-service-driver.ports";
import type {TokenServiceEngineDrivenPorts} from "./ports/token-service-engine-driven.ports";
import type {RequestTokenGenerateDTO} from "./core/dtos/request-token-generate.dto";
import type {TokenDTO} from "./core/dtos/token.dto";
import {TokenLifespanConstants} from "./core/constants/token-lifespan.constants";


export function TokenService(engine: TokenServiceEngineDrivenPorts): TokenServiceDriverPorts {

    async function generateTokens(dto: RequestTokenGenerateDTO): Promise<TokenDTO | null> {

        const entity = await engine.sign({
            userId: dto.userId,
            accessSecret: dto.accessTokenSecret,
            refreshSecret: dto.refreshTokenSecret,
            accessExpiresIn: TokenLifespanConstants.TEN_MINUTES,
            refreshExpiresIn: TokenLifespanConstants.FOUR_HOURS
        });

        if(!entity) {
            return null;
        }

        return <TokenDTO>{
            accessToken: entity.accessToken,
            refreshToken: entity.refreshToken
        }
    }

    return {
        generateTokens
    };
}
