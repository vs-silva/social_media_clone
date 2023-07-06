import type {UserServiceDriverPorts} from "./ports/user-service-driver.ports";
import type {UserServiceWriterDrivenPorts} from "./ports/user-service-writer-driven.ports";
import type {RequestUserRegisterDTO} from "./core/dtos/request-user-register.dto";
import type {UserDTO} from "./core/dtos/user.dto";
import {UserImageConstants} from "./core/constants/user-image.constants";
import Encrypter from "../encrypter";
export function UserService(writer: UserServiceWriterDrivenPorts): UserServiceDriverPorts {

    async function registerUser(dto: RequestUserRegisterDTO): Promise<UserDTO | null> {

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

    return {
        registerUser
    };
}
