import type {EncrypterServiceDriverPorts} from "./ports/encrypter-service-driver.ports";
import {EncrypterPasswordSaltRoundsConstants} from "./core/constants/encrypter-password-salt-rounds.constants";
import {EncrypterServiceEngineDrivenPorts} from "./ports/encrypter-service-engine-driven.ports";

export function EncrypterService(engine: EncrypterServiceEngineDrivenPorts): EncrypterServiceDriverPorts {

    function hashPassword(password: string): string | null {
        if(!password.trim()) {
            return null;
        }

        return engine.hashPasswordSync(password, EncrypterPasswordSaltRoundsConstants.TEN_ROUNDS);
    }

    return {
      hashPassword
    };
}
