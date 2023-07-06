export interface TokenDTO {
    userId: string;
    refreshTokenId: string;
    accessToken?: string;
    refreshToken: string;
    refreshTokenCreatedAt: Date;
    refreshTokenUpdatedAt: Date;
}
