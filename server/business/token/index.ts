import {TokenService} from "./token.service";
import {TokenServiceEngineAdapter} from "./adapters/token-service-engine.adapter";
import {TokenServiceDatabaseWriterAdapter} from "./adapters/token-service-database-writer.adapter";
import {TokenServiceDatabaseReaderAdapter} from "./adapters/token-service-database-reader.adapter";

export default TokenService(TokenServiceEngineAdapter(), TokenServiceDatabaseWriterAdapter(), TokenServiceDatabaseReaderAdapter());
