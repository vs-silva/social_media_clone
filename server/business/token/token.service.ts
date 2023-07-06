import type {TokenServiceDriverPorts} from "./ports/token-service-driver.ports";
import type {TokenServiceEngineDrivenPorts} from "./ports/token-service-engine-driven.ports";
import type {TokenServiceDatabaseWriterDrivenPorts} from "./ports/token-service-database-writer-driven.ports";
import type {TokenServiceDatabaseReaderDrivenPorts} from "./ports/token-service-database-reader-driven.ports";
import type {RequestTokenGenerateDTO} from "./core/dtos/request-token-generate.dto";
import type {TokenDTO} from "./core/dtos/token.dto";
import {TokenLifespanConstants} from "./core/constants/token-lifespan.constants";
import {RequestTokenRegisterDTO} from "~/server/business/token/core/dtos/request-token-register.dto";

export function TokenService(engine: TokenServiceEngineDrivenPorts, writer: TokenServiceDatabaseWriterDrivenPorts, reader: TokenServiceDatabaseReaderDrivenPorts): TokenServiceDriverPorts {

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
            refreshTokenCreatedAt: entity.createdAt,
        };
    }

    return {
        generateTokens,
        getRefreshTokenByToken
    };
}
