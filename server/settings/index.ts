export default {
    dbConnectionString: process.env.VITE_DATABASE_URL,
    accessTokenSecret: process.env.VITE_JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.VITE_JWT_REFRESH_TOKEN_SECRET,
    mediaCloudName: process.env.VITE_MEDIA_CLOUD_NAME,
    mediaCloudAPIKey: process.env.VITE_MEDIA_CLOUD_API_KEY,
    mediaCloudSecret: process.env.VITE_MEDIA_CLOUD_API_SECRET
};
