import {EncrypterService} from "./encrypter.service";
import {EncrypterServiceEngineAdapter} from "./adapters/encrypter-service-engine.adapter";

export default EncrypterService(EncrypterServiceEngineAdapter());
