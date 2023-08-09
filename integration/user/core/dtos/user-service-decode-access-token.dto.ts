export interface UserServiceDecodeAccessTokenDTO {
    userId: string;
    issuedAt: number;
    expiresAt: number;
    renewCountTimer: number;
}
