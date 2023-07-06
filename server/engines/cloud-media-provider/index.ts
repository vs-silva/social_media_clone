import {v2 as cloudinary} from "cloudinary";
import Settings from "../../settings";

cloudinary.config({
    cloud_name: Settings.mediaCloudName,
    api_key: Settings.mediaCloudAPIKey,
    api_secret: Settings.mediaCloudSecret
});

export default cloudinary;
