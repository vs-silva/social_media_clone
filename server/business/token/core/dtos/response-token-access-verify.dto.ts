export interface ResponseTokenAccessVerifyDTO {
    userId: string;
    createdAt: Date;
    expireAt: Date;
    isValid: boolean;
}
