import {beforeAll, describe, expect, it, vi, afterAll} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../index";
import type {RequestUserRegisterDTO} from "../core/dtos/request-user-register.dto";
import type {UserDTO} from "../core/dtos/user.dto";
import type {RequestUserAuthDTO} from "../core/dtos/request-user-auth.dto";

describe.skip('User service tests', () => {

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

        beforeAll(() => {
            fakeNewUser.username = faker.internet.userName();
        });

        //TODO add unregister here as well

        it('registerUser port should create a new user and return UserDTO', async () => {

            expect(fakeNewUser.username).toBeDefined();
            expect(fakeNewUser.password).toBeDefined();
            expect(fakeNewUser.email).toBeDefined();

            expect(User.registerUser).toBeDefined();
            expect(User.registerUser).toBeInstanceOf(Function);

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

            expect(fakeNewUser.username).toBeFalsy();

            const spy = vi.spyOn(User, 'registerUser');
            const result = await User.registerUser(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeNull();
            
        });

        afterAll(() => {
            fakeNewUser.username = '';
        });

    });


    describe('authenticateUser port tests', () => {

        let registeredUser: UserDTO | null;

        const fakeAuthCredentials: RequestUserAuthDTO = {
            username: '',
            password: '',
            accessTokenSecret: `${faker.word.words()}:${faker.word.words()}`,
            refreshTokenSecret: `${faker.word.words()}:${faker.word.words()}`
        };

        beforeAll(async () => {
            fakeNewUser.username = faker.internet.userName();
            registeredUser = await User.registerUser(fakeNewUser);
        });

        it('authenticateUser should return UserDTO with accessToken if provided login credentials are correct', async () => {

            expect(fakeAuthCredentials).toBeDefined();
            expect(fakeAuthCredentials.username).toBeFalsy();
            expect(fakeAuthCredentials.password).toBeFalsy();

            expect(registeredUser).toBeDefined();

            expect(User.authenticateUser).toBeDefined();
            expect(User.authenticateUser).toBeInstanceOf(Function);

            fakeAuthCredentials.username = registeredUser?.username as string;
            fakeAuthCredentials.password = fakeNewUser.password;

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

        it('authenticateUser should return null any if username is incorrect', async () => {

            expect(fakeAuthCredentials).toBeDefined();
            expect(registeredUser).toBeDefined();

            fakeAuthCredentials.username = faker.internet.userName();
            expect(fakeAuthCredentials.username).toBeDefined();
            expect(fakeAuthCredentials.username).not.toEqual(registeredUser?.username);

            expect(fakeAuthCredentials.password).toBeDefined();

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();

        });

        it('authenticateUser should return null any if password is incorrect', async () => {

            expect(fakeAuthCredentials).toBeDefined();
            expect(registeredUser).toBeDefined();

            fakeAuthCredentials.username = registeredUser?.username as string;
            fakeAuthCredentials.password = faker.internet.password();

            expect(registeredUser?.username).toEqual(fakeAuthCredentials.username);
            expect(fakeNewUser.password).not.toEqual(fakeAuthCredentials.password);

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();

        });

        it('authenticateUser should return null if tokens are not generated', async () => {

            expect(fakeAuthCredentials).toBeDefined();
            expect(registeredUser).toBeDefined();

            fakeAuthCredentials.accessTokenSecret = '';
            fakeAuthCredentials.refreshTokenSecret = '';

            expect(fakeAuthCredentials.username).toEqual(registeredUser?.username as string);
            fakeAuthCredentials.password = fakeNewUser.password;

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();

        });

        afterAll(() => {
            fakeNewUser.username = '';
        });

    });

    describe('getUserById port tests', () => {

        let registeredUser: UserDTO | null;

        beforeAll( async () => {
            fakeNewUser.username = faker.internet.userName();
            registeredUser = await User.registerUser(fakeNewUser);
        });

        it('getUserById should return a UserDTO if provided userId exist in data provider', async () => {

            const spy = vi.spyOn(User, 'getUserById');
            const result = await User.getUserById(registeredUser?.id as string);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(registeredUser?.id as string);

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

        it('getUserById should return Null if provided userId does not exist in data provider', async () => {

            const fakeUserId = faker.database.mongodbObjectId();

            const spy = vi.spyOn(User, 'getUserById');
            const result = await User.getUserById(fakeUserId);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeUserId);

            expect(result).toBeNull();
        });

        afterAll(() => {
            fakeNewUser.username = '';
        });
    });

});
