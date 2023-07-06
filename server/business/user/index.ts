import {UserService} from "./user.service";
import {UserServiceDatabaseWriterAdapter} from "./adapters/user-service-database-writer.adapter";
import {UserServiceDatabaseReaderAdapter} from "./adapters/user-service-database-reader.adapter";

export default UserService(UserServiceDatabaseWriterAdapter(), UserServiceDatabaseReaderAdapter());
