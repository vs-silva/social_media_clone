import type {UserServiceCryptographerDrivenPorts} from "../ports/user-service-cryptographer-driven.ports";
import type {UserServiceDecodeTokenDTO} from "../core/dtos/user-service-decode-token.dto";
import CryptographerEngine from "../../../engines/cryptographer-engine";

export function UserServiceCryptographerAdapter(): UserServiceCryptographerDrivenPorts {

    const engine = CryptographerEngine;

    async function decode(token: string): Promise<UserServiceDecodeTokenDTO | null> {

        try {
            return engine(token) as UserServiceDecodeTokenDTO;
        } catch (error) {
            return null;
        }

    }

    return {
        decode
    };
}
