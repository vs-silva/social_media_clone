import type {MediaFileCloudDTO} from "../core/dtos/media-file-cloud.dto";
import type {RequestMediaFileCreateDTO} from "../core/dtos/request-media-file-create.dto";
import type {MediaFileDTO} from "../core/dtos/media-file.dto";

export interface MediaFileServiceDriverPorts {
    uploadMediaFile(resourcePath: string): Promise<MediaFileCloudDTO | null>;
    createMediaFile(dto: RequestMediaFileCreateDTO): Promise<MediaFileDTO | null>;
    getMediaFileByTweetId(tweetId: string): Promise<MediaFileDTO | null>;
}
