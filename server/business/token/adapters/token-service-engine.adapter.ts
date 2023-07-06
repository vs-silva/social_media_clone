import type {TokenServiceEngineDrivenPorts} from "../ports/token-service-engine-driven.ports";
import TokenEngine from "../../../engines/token-engine";
import type {TokenSignEntity} from "../core/entities/token-sign.entity";
import type {RequestTokenSignDTO} from "../core/dtos/request-token-sign.dto";
import type {TokenVerifyEntity} from "../core/entities/token-verify.entity";
import type {RequestTokenVerifyDTO} from "../core/dtos/request-token-verify.dto";
import {JwtPayload} from "jsonwebtoken";

export function TokenServiceEngineAdapter(): TokenServiceEngineDrivenPorts {

    const engine = TokenEngine;
    async function sign(dto: RequestTokenSignDTO): Promise<TokenSignEntity | null> {

        try {

            const userId = dto.userId;

            return <TokenSignEntity> {
              accessToken: engine.encoder.sign({userId}, dto.accessSecret, { expiresIn: dto.accessExpiresIn}),
              refreshToken: engine.encoder.sign({userId}, dto.refreshSecret, { expiresIn: dto.refreshExpiresIn})
            };

        } catch (error) {
            return null;
        }

    }

    async function verify(dto: RequestTokenVerifyDTO): Promise<TokenVerifyEntity | null> {

        try {

            const validationResult = engine.encoder.verify(dto.token, dto.tokenSecret) as JwtPayload;

            if(!validationResult.iat || !validationResult.exp) {
                return null;
            }

            return <TokenVerifyEntity> {
                userId: validationResult.userId,
                createdAt: new Date(validationResult.iat as number * 1000),
                expireAt: new Date(validationResult.exp as number * 1000),
                isValid: true
            };

        } catch (error) {
            return null;
        }

    }

    // @ts-ignore
    return {
      sign,
      verify
    };
}
