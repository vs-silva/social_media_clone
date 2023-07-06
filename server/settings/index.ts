export default {
    dbConnectionString: process.env.DATABASE_URL,
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    mediaCloudName: process.env.MEDIA_CLOUD_NAME,
    mediaCloudAPIKey: process.env.MEDIA_CLOUD_API_KEY,
    mediaCloudSecret: process.env.MEDIA_CLOUD_API_SECRET
};
