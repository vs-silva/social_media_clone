export interface UserEntity {
    id: string;
    email: string;
    name?: string;
    username: string;
    password: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}
