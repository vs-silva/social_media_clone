import {MediaFileService} from "./media-file.service";
import {MediaFileServiceCloudEngineAdapter} from "./adapters/media-file-service-cloud-engine.adapter";

export default MediaFileService(MediaFileServiceCloudEngineAdapter());
