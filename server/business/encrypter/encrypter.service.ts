import type {EncrypterServiceDriverPorts} from "./ports/encrypter-service-driver.ports";
import type {EncrypterServiceEngineDrivenPorts} from "./ports/encrypter-service-engine-driven.ports";
import {EncrypterPasswordSaltRoundsConstants} from "./core/constants/encrypter-password-salt-rounds.constants";

export function EncrypterService(engine: EncrypterServiceEngineDrivenPorts): EncrypterServiceDriverPorts {

    function hashPassword(password: string): string | null {
        if(!password.trim()) {
            return null;
        }

        return engine.hashPasswordSync(password, EncrypterPasswordSaltRoundsConstants.TEN_ROUNDS);
    }

    async function isPasswordValid(password: string, existentPassword: string): Promise<boolean | null> {

        if(!password.trim() || !existentPassword.trim()) {
            return null;
        }

        return await engine.comparePasswords(password, existentPassword);
    }

    return {
      hashPassword,
      isPasswordValid
    };
}
