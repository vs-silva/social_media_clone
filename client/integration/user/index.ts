import {UserService} from "./user.service";
import {UserServiceApiWriterAdapter} from "./adapters/user-service-api-writer.adapter";
import {UserServiceApiReaderAdapter} from "./adapters/user-service-api-reader.adapter";

export default UserService(UserServiceApiWriterAdapter(), UserServiceApiReaderAdapter());
