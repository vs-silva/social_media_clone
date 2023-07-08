import type {TokenServiceDriverPorts} from "./ports/token-service-driver.ports";
import type {TokenServiceEngineDrivenPorts} from "./ports/token-service-engine-driven.ports";
import type {TokenServiceWriterDrivenPorts} from "./ports/token-service-writer-driven.ports";
import type {TokenServiceReaderDrivenPorts} from "./ports/token-service-reader-driven.ports";
import type {RequestTokenGenerateDTO} from "./core/dtos/request-token-generate.dto";
import type {TokenDTO} from "./core/dtos/token.dto";
import type {RequestTokenRegisterDTO} from "./core/dtos/request-token-register.dto";
import type {RequestTokenVerifyDTO} from "./core/dtos/request-token-verify.dto";
import {TokenLifespanConstants} from "./core/constants/token-lifespan.constants";


export function TokenService(engine: TokenServiceEngineDrivenPorts, writer: TokenServiceWriterDrivenPorts, reader: TokenServiceReaderDrivenPorts): TokenServiceDriverPorts {

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

        const tokenEntity = await writer.save(<RequestTokenRegisterDTO> {
            userId: dto.userId,
            refreshToken: entity.refreshToken
        });

        if(!tokenEntity) {
            return null;
        }

        return <TokenDTO>{
            userId: dto.userId,
            refreshTokenId: tokenEntity.id,
            accessToken: entity.accessToken,
            refreshToken: entity.refreshToken,
            refreshTokenCreatedAt: tokenEntity.createdAt,
            refreshTokenUpdatedAt: tokenEntity.updatedAt
        };
    }

    async function getRefreshTokenByToken(refreshToken: string): Promise<TokenDTO | null> {

        if(!refreshToken) {
            return null;
        }

        const entity = await reader.getBy(() => ({token: refreshToken}));

        if(!entity) {
            return null;
        }

        return <TokenDTO> {
            userId: entity.userId,
            refreshToken: entity.refreshToken,
            refreshTokenId: entity.id,
            refreshTokenUpdatedAt: entity.updatedAt,
            refreshTokenCreatedAt: entity.createdAt
        };
    }

    async function verifyToken(dto: RequestTokenVerifyDTO): Promise<TokenDTO | null> {

        if(!dto.id?.trim() || !dto.token?.trim() || !dto.tokenSecret?.trim() ) {
            return null;
        }

        const tokenVerifyEntity = await engine.verify(dto);

        if(!tokenVerifyEntity) {
            return null;
        }

        const tokenEntity = await reader.getBy(() => ({id: dto.id}));

        if(!tokenEntity) {
            return null;
        }

        return <TokenDTO>{
            userId: tokenVerifyEntity.userId,
            refreshToken: dto.token,
            refreshTokenId: dto.id,
            refreshTokenUpdatedAt: tokenEntity.updatedAt,
            refreshTokenCreatedAt: tokenEntity.createdAt,
            refreshExpireAtDate: tokenVerifyEntity.expireAt,
            isValid: tokenVerifyEntity.isValid
        };

    }

    return {
        generateTokens,
        getRefreshTokenByToken,
        verifyToken
    };
}
