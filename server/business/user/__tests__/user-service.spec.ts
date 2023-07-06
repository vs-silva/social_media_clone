import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../index";
import type {RequestUserRegisterDTO} from "../core/dtos/request-user-register.dto";
import type {UserDTO} from "../core/dtos/user.dto";

describe('User service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const hashedPasswordRegex = /\$2b\$10\$[./A-Za-z0-9]{53}/;

    describe('registerUser port tests', () => {

        const fakePassword = faker.internet.password();

        const fakeNewUser: RequestUserRegisterDTO = {
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: '',
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        };

        it('registerUser port should create a new user and return UserDTO', async () => {

            fakeNewUser.username = faker.internet.userName();

            const spy = vi.spyOn(User, 'registerUser');
            const result = await User.registerUser(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeTruthy();
            expect(result?.id).toBeTruthy();
            expect(result?.id).toMatch(idRegex);
            expect(result?.password).toMatch(hashedPasswordRegex);

            expect(result).toStrictEqual(expect.objectContaining(<UserDTO>{
                id: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
                username: expect.any(String),
                name: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(Date),
                profileLastUpdateDate: expect.any(Date)
            }));
        });

    });

});
