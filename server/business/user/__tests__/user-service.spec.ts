import {beforeAll, describe, expect, it, vi, afterAll} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../index";
import type {RequestUserRegisterDTO} from "../core/dtos/request-user-register.dto";
import type {UserDTO} from "../core/dtos/user.dto";
import type {RequestUserAuthDTO} from "../core/dtos/request-user-auth.dto";


describe('User service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const hashedPasswordRegex = /\$2b\$10\$[./A-Za-z0-9]{53}/;

    const fakePassword = faker.internet.password();

    describe('registerUser port tests', () => {

        const fakeNewUser: RequestUserRegisterDTO = {
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: faker.internet.userName(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        };

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

        it('registerUser port should not create a new user and return null if a user with the same username already exists', async () => {

            const spy = vi.spyOn(User, 'registerUser');
            const result = await User.registerUser(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeNull();

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

        it('registerUser port should not create a new user and return null if password and repeatPassword do not match', async () => {

            fakeNewUser.username = faker.internet.userName();
            fakeNewUser.repeatPassword = faker.internet.password();

            expect(fakeNewUser.repeatPassword).not.toEqual(fakeNewUser.password);

            const spy = vi.spyOn(User, 'registerUser');
            const result = await User.registerUser(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeNull();

        });

    });

    describe('authenticateUser port tests', () => {

        const fakeAuthCredentials: RequestUserAuthDTO = {
            username: '',
            password: '',
            accessTokenSecret: `${faker.word.words()}:${faker.word.words()}`,
            refreshTokenSecret: `${faker.word.words()}:${faker.word.words()}`
        };

        let registeredUser: UserDTO | null;

        beforeAll(async () => {

            registeredUser = await User.registerUser(<RequestUserRegisterDTO>{
                email: faker.internet.email(),
                password: fakePassword,
                repeatPassword: fakePassword,
                username: faker.internet.userName(),
                name: `${faker.person.firstName()} ${faker.person.lastName()}`
            });

            fakeAuthCredentials.username = registeredUser?.username as string;
            fakeAuthCredentials.password = fakePassword;
        });

        it('authenticateUser should return UserDTO with accessToken if provided login credentials are correct', async () => {

            expect(User.authenticateUser).toBeDefined();
            expect(User.authenticateUser).toBeInstanceOf(Function);

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

        it('authenticateUser should return null if username is incorrect', async () => {

            fakeAuthCredentials.username = faker.internet.userName();
            expect(fakeAuthCredentials.username).toBeDefined();
            expect(fakeAuthCredentials.password).toBeDefined();

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();

        });

        it('authenticateUser should return null if password is incorrect', async () => {

            fakeAuthCredentials.username = registeredUser?.username as string;
            fakeAuthCredentials.password = faker.internet.password();

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();

        });

        it('authenticateUser should return null if tokens are not generated', async () => {

            fakeAuthCredentials.username = registeredUser?.username as string;
            fakeAuthCredentials.password = fakePassword;

            fakeAuthCredentials.accessTokenSecret = '';
            fakeAuthCredentials.refreshTokenSecret = '';

            const spy = vi.spyOn(User, 'authenticateUser');
            const result = await User.authenticateUser(fakeAuthCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeAuthCredentials);

            expect(result).toBeNull();
        });


        describe('getUserById port tests', () => {

            it('getUserById should return a UserDTO if provided userId exist in data provider', async () => {

                expect(User.getUserById).toBeDefined();
                expect(User.getUserById).toBeInstanceOf(Function);

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

        });

        afterAll(() => {
            registeredUser = null;
        });

    });

});
