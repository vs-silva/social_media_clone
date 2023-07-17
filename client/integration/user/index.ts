import {UserService} from "./user.service";
import {UserServiceApiWriterAdapter} from "./adapters/user-service-api-writer.adapter";

export default UserService(UserServiceApiWriterAdapter());
