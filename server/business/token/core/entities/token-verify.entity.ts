export interface TokenVerifyEntity {
    userId: string;
    createdAt: Date;
    expireAt: Date;
    isValid: boolean;
}
