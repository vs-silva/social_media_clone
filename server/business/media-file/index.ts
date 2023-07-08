import {MediaFileService} from "./media-file.service";
import {MediaFileServiceCloudEngineAdapter} from "./adapters/media-file-service-cloud-engine.adapter";
import {MediaFileServiceDatabaseWriterAdapter} from "./adapters/media-file-service-database-writer.adapter";

export default MediaFileService(MediaFileServiceCloudEngineAdapter(), MediaFileServiceDatabaseWriterAdapter());
