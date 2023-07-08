import type {MediaFileEntity} from "../core/entities/media-file.entity";
import type {RequestMediaFileCreateDTO} from "../core/dtos/request-media-file-create.dto";

export interface MediaFileServiceWriterDrivenPorts {
    save(dto: RequestMediaFileCreateDTO): Promise<MediaFileEntity | null>;
}
