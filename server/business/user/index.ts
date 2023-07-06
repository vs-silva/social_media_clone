import {UserService} from "./user.service";
import {UserServiceDatabaseWriterAdapter} from "./adapters/user-service-database-writer.adapter";

export default UserService(UserServiceDatabaseWriterAdapter());
