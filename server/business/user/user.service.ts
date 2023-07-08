import type {UserServiceDriverPorts} from "./ports/user-service-driver.ports";
import type {UserServiceWriterDrivenPorts} from "./ports/user-service-writer-driven.ports";
import type {UserServiceReaderDrivenPorts} from "./ports/user-service-reader-driven.ports";
import type {RequestUserRegisterDTO} from "./core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "./core/dtos/request-user-auth.dto";
import type {UserDTO} from "./core/dtos/user.dto";
import type {RequestTokenGenerateDTO} from "../token/core/dtos/request-token-generate.dto";
import {UserImageConstants} from "./core/constants/user-image.constants";
import Encrypter from "../encrypter";
import Token from "../token";


export function UserService(writer: UserServiceWriterDrivenPorts, reader: UserServiceReaderDrivenPorts): UserServiceDriverPorts {

    async function registerUser(dto: RequestUserRegisterDTO): Promise<UserDTO | null> {

        if(!dto.username.trim() || !dto.email.trim() || !dto.password.trim() || !dto.repeatPassword.trim()) {
            return null;
        }

        const entity = await writer.save({
            email: dto.email,
            username: dto.username,
            password: Encrypter.hashPassword(dto.password) as string,
            name: dto.name,
            profileImage: UserImageConstants.PROFILE_IMAGE
        });

        if(!entity) {
            return null;
        }

        return <UserDTO>{
            id: entity.id,
            password: entity.password,
            name: entity.name,
            profileImage: entity.profileImage,
            username: entity.username,
            email: entity.email,
            profileLastUpdateDate: entity.updatedAt,
            profileCreateDate: entity.createdAt
        };

    }

    async function authenticateUser(dto: RequestUserAuthDTO): Promise<UserDTO | null> {

        const entity = await reader.getBy(() => ({username: dto.username}));

        if(!entity) {
            return null;
        }

        if(!await Encrypter.isPasswordValid(dto.password, entity.password)) {
            return null;
        }

        const tokens = await Token.generateTokens(<RequestTokenGenerateDTO> {
            userId: entity.id,
            accessTokenSecret: dto.accessTokenSecret,
            refreshTokenSecret: dto.refreshTokenSecret
        });


        if(!tokens) {
            return null;
        }

        return <UserDTO>{
            id: entity.id,
            password: entity.password,
            name: entity.name,
            profileImage: entity.profileImage,
            username: entity.username,
            email: entity.email,
            profileLastUpdateDate: entity.updatedAt,
            profileCreateDate: entity.createdAt,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        };
    }

    async function getUserById(userId: string): Promise<UserDTO | null> {

        if(!userId.trim()) {
            return null;
        }

        const entity = await reader.getBy(() => ({id: userId}));

        if(!entity) {
            return null;
        }

        return <UserDTO>{
            id: entity.id,
            password: entity.password,
            name: entity.name,
            profileImage: entity.profileImage,
            username: entity.username,
            email: entity.email,
            profileLastUpdateDate: entity.updatedAt,
            profileCreateDate: entity.createdAt
        };

    }

    return {
        registerUser,
        authenticateUser,
        getUserById
    };
}
