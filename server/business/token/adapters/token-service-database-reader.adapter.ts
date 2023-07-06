import type {TokenServiceDatabaseReaderDrivenPorts} from "../ports/token-service-database-reader-driven.ports";
import type {TokenEntity} from "../core/entities/token.entity";
import DataProvider from "../../../engines/data-provider";
import {RefreshToken} from "@prisma/client";

export function TokenServiceDatabaseReaderAdapter(): TokenServiceDatabaseReaderDrivenPorts {

    const engine = DataProvider;

    async function getBy(expression: () => {}): Promise<TokenEntity | null> {

        try {

            const dbEntity: RefreshToken | null = await engine.refreshToken.findUnique({
               where: expression()
            });

            if(!dbEntity) {
                return null;
            }

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
      getBy
    };
}
