import type {MediaFileEntity} from "../core/entities/media-file.entity";

export interface MediaFileServiceReaderDrivenPorts {
    getBy(expression: () => {}): Promise<MediaFileEntity | null>;
}
