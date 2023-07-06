import type {TokenEntity} from "../core/entities/token.entity";

export interface TokenServiceDatabaseReaderDrivenPorts {
    getBy(expression: () => {}): Promise<TokenEntity | null>;
}
