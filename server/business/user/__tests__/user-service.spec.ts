import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../index";
import type {RequestUserRegisterDTO} from "../core/dtos/request-user-register.dto";
import type {UserDTO} from "../core/dtos/user.dto";
import type {RequestUserAuthDTO} from "../core/dtos/request-user-auth.dto";

describe('User service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const hashedPasswordRegex = /\$2b\$10\$[./A-Za-z0-9]{53}/;

    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: '',
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    describe('registerUser port tests', () => {

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

        it('registerUser port should not create a new user and return null if required field is not provided', async () => {

            fakeNewUser.username = '';

            const spy = vi.spyOn(User, 'registerUser');
            const result = await User.registerUser(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeNull();
            
        });

    });

    describe('authenticateUser port tests', () => {

        it('authenticateUser should return UserDTO with accessToken if provided login credentials are correct', async ()=>{

            fakeNewUser.username = faker.internet.userName();
            const user = await User.registerUser(fakeNewUser);

            const fakeAuthCredentials: RequestUserAuthDTO = {
                username: user?.username as string,
                password: fakeNewUser.password,
                accessTokenSecret: `${faker.word.words()}:${faker.word.words()}`,
                refreshTokenSecret: `${faker.word.words()}:${faker.word.words()}`
            };

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeTruthy();
            expect(result?.id).toBeTruthy();
            expect(result?.id).toMatch(idRegex);
            expect(result?.password).toMatch(hashedPasswordRegex);
            expect(result?.accessToken).toBeTruthy();
            expect(result?.refreshToken).toBeTruthy();

            expect(result).toStrictEqual(expect.objectContaining(<UserDTO>{
                id: expect.any(String),
                email: expect.any(String),
                password: expect.any(String),
                username: expect.any(String),
                name: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(Date),
                profileLastUpdateDate: expect.any(Date),
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
            }));

        });

        it('authenticateUser should return null any if of login credentials are missing or incorrect', async () => {

            fakeNewUser.username = faker.internet.userName();
            const user = await User.registerUser(fakeNewUser);

            const fakeAuthCredentials: RequestUserAuthDTO = {
                username: user?.username as string,
                password: faker.internet.password(),
                accessTokenSecret: `${faker.word.words()}:${faker.word.words()}`,
                refreshTokenSecret: `${faker.word.words()}:${faker.word.words()}`
            };

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();
        });

    });

    describe('getUserById port tests', () => {

        it.todo('getUserById should return a UserDTO if provided userId exist in data provider');
        it.todo('getUserById should return Null if provided userId does not exist in data provider');
        it.todo('getUserById should return Null if no userId is provided');

    });

});
