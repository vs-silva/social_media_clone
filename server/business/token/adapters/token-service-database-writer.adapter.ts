import type {TokenServiceDatabaseWriterDrivenPorts} from "../ports/token-service-database-writer-driven.ports";
import type {TokenEntity} from "../core/entities/token.entity";
import type {RequestTokenRegisterDTO} from "../core/dtos/request-token-register.dto";
import DataProvider from "../../../engines/data-provider";
import {RefreshToken} from "@prisma/client";

export function TokenServiceDatabaseWriterAdapter(): TokenServiceDatabaseWriterDrivenPorts {

    const engine = DataProvider;

    async function save(dto: RequestTokenRegisterDTO): Promise<TokenEntity | null> {

        try {
            const dbEntity: RefreshToken = await engine.refreshToken.create({
                data: {
                    token: dto.refreshToken,
                    userId: dto.userId
                }
            });

            return <TokenEntity>{
              id: dbEntity.id,
              userId: dbEntity.userId,
              refreshToken: dbEntity.token,
              createdAt: dbEntity.createdAt,
              updatedAt: dbEntity.updatedAt
            };

        } catch (error) {
            return null;
        }
    }

    return {
        save
    };
}
