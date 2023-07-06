export interface RequestTokenSignDTO {
    userId: string;
    accessSecret: string;
    refreshSecret: string;
    accessExpiresIn: string;
    refreshExpiresIn: string;
}
