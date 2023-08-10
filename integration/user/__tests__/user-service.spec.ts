import {describe, expect, it, vi, afterAll, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../index";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";
import type {ResponseTokenRefreshDTO} from "../../../server/business/token/core/dtos/response-token-refresh.dto";
import type {UserServiceDecodeAccessTokenDTO} from "../core/dtos/user-service-decode-access-token.dto";


describe('Integration: User service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;

    describe('signup port tests', () => {

        const fakePassword = faker.internet.password();

        const fakeNewUser: RequestUserRegisterDTO = {
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: faker.internet.userName(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        };

        it('signup should take a RequestUserRegisterDTO create a new user and return a ResponseUserRegisterDTO', async () => {

            expect(User.signup).toBeDefined();
            expect(User.signup).toBeInstanceOf(Function);

            const spy = vi.spyOn(User, 'signup');
            const result = await User.signup(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeTruthy();
            expect(result?.id).toBeTruthy();
            expect(result?.id).toMatch(idRegex);

            expect(result).toStrictEqual(expect.objectContaining(<ResponseUserRegisterDTO>{
                id: expect.any(String),
                username: expect.any(String),
                email: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(String),
                profileLastUpdateDate: expect.any(String),
            }));
        }, {
            retry: 3,
            timeout: 10000
        });

    });

    describe('login port tests', () => {

        const fakePassword = faker.internet.password();

        let user: ResponseUserRegisterDTO | null;

        beforeAll(async ()=> {

            user = await User.signup(<RequestUserRegisterDTO>{
                email: faker.internet.email(),
                password: fakePassword,
                repeatPassword: fakePassword,
                username: faker.internet.userName(),
                name: `${faker.person.firstName()} ${faker.person.lastName()}`
            });

        });

        it('login should take a RequestUserAuthDTO allow access to a registered user and return a ResponseUserAuthDTO', async () => {

            expect(user).toBeDefined();

            expect(User.login).toBeDefined();
            expect(User.login).toBeInstanceOf(Function);

            const loginCredentials: RequestUserAuthDTO = {
                username: user?.username as string,
                password: fakePassword
            };

            const spy = vi.spyOn(User, 'login');
            const result = await User.login(loginCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(loginCredentials);

            expect(result).toBeTruthy();

            expect(result).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
                id: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(String),
                profileLastUpdateDate: expect.any(String),
                accessToken: expect.any(String)
            }));

        });

        it('login should return null if provided login credentials are invalid', async () => {

            const loginCredentials: RequestUserAuthDTO = {
                username: faker.internet.userName(),
                password: fakePassword
            };

            const spy = vi.spyOn(User, 'login');
            const result = await User.login(loginCredentials);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(loginCredentials);

            expect(result).toBeNull();

        });

        afterAll(() => {
            user = null;
        });

    });


    describe('refreshToken port tests', () => {

        const fakePassword = faker.internet.password();
        let user: ResponseUserAuthDTO | null;

        beforeAll(async () => {

            const signedUser = await User.signup(<RequestUserRegisterDTO>{
                email: faker.internet.email(),
                password: fakePassword,
                repeatPassword: fakePassword,
                username: faker.internet.userName(),
                name: `${faker.person.firstName()} ${faker.person.lastName()}`
            });

            user = await User.login(<RequestUserAuthDTO>{
                username: signedUser?.username,
                password: fakePassword
            });
        });

        it('refreshToken should return a ResponseTokenRefreshDTO with accessToken for registered and loggedIn user with a valid accessToken', async () =>{

            expect(user).toBeDefined();
            expect(user?.accessToken).toBeDefined();

            expect(User.refreshToken).toBeDefined();
            expect(User.refreshToken).toBeInstanceOf(Function);

            const spy = vi.spyOn(User, 'refreshToken');
            const result = await User.refreshToken();

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();

            expect(result).toBeTruthy();
            expect(result?.userId).toMatch(idRegex);
            expect(result?.accessToken).toBeDefined();

            expect(result).toStrictEqual(expect.objectContaining(<ResponseTokenRefreshDTO>{
                userId: expect.any(String),
                accessToken: expect.any(String),
            }));

        }, {retry: 3});

        describe('getUser port tests', () => {

            beforeAll( async () => {
                await User.refreshToken();
            });

            it('getUser should return a ResponseUserAuthDTO for registered and loggedIn user with a valid accessToken', async () => {

                expect(User.getUser).toBeDefined();
                expect(User.getUser).toBeInstanceOf(Function);

                const spy = vi.spyOn(User, 'getUser');
                const result = await User.getUser();

                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledWith();

                expect(result).not.toBeNull();

                expect(result).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
                    id: expect.any(String),
                    email: expect.any(String),
                    username: expect.any(String),
                    profileImage: expect.any(String),
                    profileCreateDate: expect.any(String),
                    profileLastUpdateDate: expect.any(String),
                    accessToken: expect.any(String)
                }));

            });

        });

        describe('decodeAccessToken port tests', () => {

            it('decodeAccessToken should return a UserServiceDecodeAccessTokenDTO if provided accessToken is valid', async () => {

                expect(User.decodeAccessToken).toBeDefined();
                expect(User.decodeAccessToken).toBeInstanceOf(Function);

                const spy = vi.spyOn(User, 'decodeAccessToken');
                const result = await User.decodeAccessToken(user?.accessToken as string);

                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledWith(user?.accessToken as string);

                expect(result).toBeDefined();

                expect(result).toStrictEqual(expect.objectContaining(<UserServiceDecodeAccessTokenDTO>{
                    userId: expect.any(String),
                    issuedAt: expect.any(Number),
                    expiresAt: expect.any(Number),
                    renewCountTimer: expect.any(Number)
                }));

            });

            it('should return a null if provided accessToken is invalid', async () => {

                const fakeAccessToken = faker.word.sample(20);

                const spy = vi.spyOn(User, 'decodeAccessToken');
                const result = await User.decodeAccessToken(fakeAccessToken);

                expect(spy).toHaveBeenCalled();
                expect(spy).toHaveBeenCalledWith(fakeAccessToken);

                expect(result).toBeNull();
            });

        });

        afterAll(() => {
            user = null;
        });

    });
});
