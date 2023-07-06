import {TokenService} from "./token.service";
import {TokenServiceEngineAdapter} from "./adapters/token-service-engine.adapter";

export default TokenService(TokenServiceEngineAdapter());
