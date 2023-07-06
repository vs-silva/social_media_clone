import type {TokenServiceEngineDrivenPorts} from "../ports/token-service-engine-driven.ports";
import TokenEngine from "../../../engines/token-engine";
import type {TokenSignEntity} from "../core/entities/token-sign.entity";
import type {RequestTokenSignDTO} from "../core/dtos/request-token-sign.dto";

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

    return {
      sign
    };
}
