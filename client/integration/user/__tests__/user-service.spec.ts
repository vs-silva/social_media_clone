import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import type{RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../../server/business/user/core/dtos/response-user-auth.dto";
import type {ResponseTokenRefreshDTO} from "../../../../server/business/token/core/dtos/response-token-refresh.dto";
import {
    UserServiceDecodeAccessTokenDTO
} from "~/client/integration/user/core/dtos/user-service-decode-access-token.dto";

describe('Integration: User service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const tokenRegex = /^([A-Za-z0-9-_=]+\.)+([A-Za-z0-9-_=]+)+(\.[A-Za-z0-9-_.+/=]+)?$/;
    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: '',
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    describe('signup port tests', () => {

        it('signup should take a RequestUserAuthDTO create a new user and return a ResponseUserRegisterDTO', async () => {

            fakeNewUser.username = faker.internet.userName();

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

        });

        it('signup should return null if RequestUserAuthDTO field is missing or invalid', async () => {

            fakeNewUser.username = ' ';

            const spy = vi.spyOn(User, 'signup');
            const result = await User.signup(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeNull();
        });

    });

    describe('login port tests', () => {

        it('login should take a RequestUserAuthDTO allow access to a registered user and return a ResponseUserAuthDTO', async () => {

            fakeNewUser.username = faker.internet.userName();
            const registeredUser = await User.signup(fakeNewUser);

            const requestPayload:RequestUserAuthDTO = {
                username: registeredUser?.username as string,
                password: fakeNewUser.password
            };

            const spy = vi.spyOn(User, 'login');
            const result = await User.login(requestPayload);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(requestPayload);

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

            const fakeRequestPayload: RequestUserAuthDTO = {
              username: faker.internet.userName(),
              password: faker.internet.password()
            };

            const spy = vi.spyOn(User, 'login');
            const result = await User.login(fakeRequestPayload);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeRequestPayload);

            expect(result).toBeNull();

        });

    });

    describe('refreshToken port tests', () => {

        it('refreshToken should return a ResponseTokenRefreshDTO with accessToken for registered and logged in user with a valid accessToken', async () => {

            fakeNewUser.username = faker.internet.userName();
            const registeredUser = await User.signup(fakeNewUser);

            const loginPayload:RequestUserAuthDTO = {
                username: registeredUser?.username as string,
                password: fakeNewUser.password
            };

            const loggedInUser = await User.login(loginPayload);
            expect(loggedInUser?.id).toBeTruthy();
            expect(loggedInUser?.accessToken).toBeTruthy();

            const spy = vi.spyOn(User, 'refreshToken');
            const result = await User.refreshToken(loggedInUser?.accessToken as string);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(loggedInUser?.accessToken);
            expect(result).toBeTruthy();

            expect(result?.userId).toMatch(idRegex);
            expect(result?.accessToken).toMatch(tokenRegex);

            expect(result).toStrictEqual(expect.objectContaining(<ResponseTokenRefreshDTO>{
                userId: expect.any(String),
                accessToken: expect.any(String),
            }));

        });

        it('refreshToken should return null for an invalid accessToken', async () => {

            const fakeAccessToken = faker.word.sample(10);

            const spy = vi.spyOn(User, 'refreshToken');
            const result = await User.refreshToken(fakeAccessToken);

            expect(spy).toHaveBeenCalledWith(fakeAccessToken);

            expect(spy).toHaveBeenCalledOnce();
            expect(result).toBeNull();
        });

    });

    describe('getUser port tests', () => {

        it('getUser should return a ResponseUserAuthDTO for registered and logged in user with a valid accessToken', async () => {

            fakeNewUser.username = faker.internet.userName();
            const registeredUser = await User.signup(fakeNewUser);

            const loginPayload:RequestUserAuthDTO = {
                username: registeredUser?.username as string,
                password: fakeNewUser.password
            };

            const loggedInUser = await User.login(loginPayload);
            await User.refreshToken(loggedInUser?.accessToken as string);

            const spy = vi.spyOn(User, 'getUser');
            const result = await User.getUser(loggedInUser?.accessToken as string);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(loggedInUser?.accessToken as string);

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

        it('getUser should return null for an invalid accessToken', async () => {

            const fakeAccessToken = faker.word.sample(5);

            const spy = vi.spyOn(User, 'getUser');
            const result = await User.getUser(fakeAccessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(fakeAccessToken);

            expect(result).toBeNull();

        });


    });

    describe('decodeAccessToken port tests', () => {

        it('should return a UserServiceDecodeAccessTokenDTO if provided accessToken is valid', async () => {

            fakeNewUser.username = faker.internet.userName();
            const registeredUser = await User.signup(fakeNewUser);

            const loginPayload:RequestUserAuthDTO = {
                username: registeredUser?.username as string,
                password: fakeNewUser.password
            };

            const loggedInUser = await User.login(loginPayload);

            const spy = vi.spyOn(User, 'decodeAccessToken');
            const result = await User.decodeAccessToken(loggedInUser?.accessToken as string);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(loggedInUser?.accessToken as string);

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

});
