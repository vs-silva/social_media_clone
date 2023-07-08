import type {TokenEntity} from "../core/entities/token.entity";

export interface TokenServiceReaderDrivenPorts {
    getBy(expression: () => {}): Promise<TokenEntity | null>;
}
