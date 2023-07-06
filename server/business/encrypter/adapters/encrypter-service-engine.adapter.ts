import type{EncrypterServiceEngineDrivenPorts} from "../ports/encrypter-service-engine-driven.ports";
import EncrypterEngine from "../../../engines/encrypter-engine";

export function EncrypterServiceEngineAdapter(): EncrypterServiceEngineDrivenPorts {

    const engine = EncrypterEngine;

    function hashPasswordSync(password: string, saltRounds: number): string {
        return engine.hashSync(password, saltRounds);
    }

    return {
      hashPasswordSync
    };
}
