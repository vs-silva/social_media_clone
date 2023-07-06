export interface UserDTO {
    id?: string;
    email: string;
    password: string;
    username: string;
    name?: string;
    profileImage?: string;
    profileCreateDate?: Date;
    profileLastUpdateDate?: Date;
    accessToken?: string;
    refreshToken?: string;
}
