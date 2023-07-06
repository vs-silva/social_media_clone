import type {UserServiceReaderDrivenPorts} from "../ports/user-service-reader-driven.ports";
import type {UserEntity} from "../core/entities/user.entity";
import DataProvider from "../../../engines/data-provider";
import {User} from "@prisma/client";

export function UserServiceDatabaseReaderAdapter(): UserServiceReaderDrivenPorts {

    const engine = DataProvider;

    async function getBy(expression: () => {}): Promise<UserEntity | null> {

        try {

            const dbEntity: User | null = await engine.user.findUnique({
                where: expression()
            });

            if(!dbEntity) {
                return null;
            }

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


        } catch (error) {
            return null;
        }

    }

    return {
      getBy
    };
}
