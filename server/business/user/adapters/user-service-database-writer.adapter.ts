import type {UserServiceWriterDrivenPorts} from "../ports/user-service-writer-driven.ports";
import type {UserDTO} from "../core/dtos/user.dto";
import type {UserEntity} from "../core/entities/user.entity";
import DataProvider from "../../../engines/data-provider";
import {User} from "@prisma/client";

export function UserServiceDatabaseWriterAdapter(): UserServiceWriterDrivenPorts {

    const engine = DataProvider;
    async function save(dto: UserDTO): Promise<UserEntity | null> {

        try {

            const dbEntity: User = await engine.user.create({
                data: {
                    email: dto.email,
                    username:dto.username,
                    password: dto.password,
                    name: dto.name,
                    profileImage: dto.profileImage
                }
            });

            return <UserEntity>{
                id: dbEntity.id,
                name: dbEntity.name,
                email: dbEntity.email,
                username: dbEntity.username,
                password: dbEntity.password,
                profileImage: dbEntity.profileImage,
                createdAt: dbEntity.createdAt,
                updatedAt: dbEntity.updatedAt
            };

        } catch ( error ) {
            return null;
        }

    }

    return {
        save
    };
}
