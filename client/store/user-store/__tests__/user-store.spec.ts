import {describe, it, expect, vi, afterAll, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../../server/business/user/core/dtos/response-user-auth.dto";

describe('User store tests', async () => {

    const retries: number = 3;

    setActivePinia(createPinia());
    const userStore = Store.useUserStore();
    const { signup, login, renewAccessToken, refreshToken, getUser } = userStore;
    const { user } = storeToRefs(userStore);

    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: '',
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    describe('signup port tests', () => {

        beforeAll(() => {
            fakeNewUser.username = faker.internet.userName();
            user.value = null;
        });

        it('sign up should take RequestUserRegisterDTO, perform the user registration', async () => {

            expect(fakeNewUser).toBeDefined();
            expect(fakeNewUser.username).toBeDefined();

            expect(user).toBeDefined();
            expect(user.value).toBeNull();

            expect(signup).toBeDefined();
            expect(signup).toBeInstanceOf(Function);

            const spy = vi.fn(signup);
            await spy(fakeNewUser);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(user.value).toBeDefined();

            expect(user.value).toStrictEqual(expect.objectContaining(<ResponseUserRegisterDTO>{
                id: expect.any(String),
                username: expect.any(String),
                email: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(String),
                profileLastUpdateDate: expect.any(String),
            }));

        }, { retry: retries });

        afterAll(() => {
            user.value = null;
        });

    });


    describe('login port tests', () => {

        beforeAll(async () => {
            fakeNewUser.username = faker.internet.userName();
            user.value = null;

            await signup(fakeNewUser);
        });

        it('login should allow a registered user to access the application by providing a accessToken', async () => {

            expect(user.value).toBeDefined();
            expect(user.value?.username).toBeDefined();

            expect(login).toBeDefined();
            expect(login).toBeInstanceOf(Function);

            const userAuthDTO: RequestUserAuthDTO = {
                username: user.value?.username as string,
                password: fakePassword
            };

            const spy = vi.fn(login);
            await spy(userAuthDTO);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(userAuthDTO);

            expect(user.value).toBeDefined();

            expect(user.value).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
                id: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(String),
                profileLastUpdateDate: expect.any(String),
                accessToken: expect.any(String)
            }));

        }, { retry: retries });

        afterAll(() => {
            user.value = null;
        });

    });

    describe('renewAccessToken port tests', () => {

        beforeAll(async () => {
            fakeNewUser.username = faker.internet.userName();
            user.value = null;

            await signup(fakeNewUser);
            await login({
               username: fakeNewUser.username,
               password: fakePassword
            });
        });

        it('renewAccessToken should ask for user accessToken renew and return ResponseUserAuthDTO', async () => {

            expect(user.value).toBeDefined();
            const accessToken = (user.value as ResponseUserAuthDTO)?.accessToken as string;
            expect(accessToken).toBeTruthy();

            expect(renewAccessToken).toBeDefined();
            expect(renewAccessToken).toBeInstanceOf(Function);

            const spy = vi.fn(renewAccessToken);
            await spy(accessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(accessToken);

            expect(user.value).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
                id: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(String),
                profileLastUpdateDate: expect.any(String),
                accessToken: expect.any(String)
            }));


        }, { retry: retries });

        it('renewAccessToken should return if accessToken is not provided', async () => {

            const fakeAccessToken = '   ';

            const spy = vi.fn(renewAccessToken);
            await spy(fakeAccessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(fakeAccessToken);

            expect(spy).toReturn();

        });

        afterAll(() => {
            user.value = null;
        });

    });

    describe('refreshToken port tests', () => {

        beforeAll(async () => {
            fakeNewUser.username = faker.internet.userName();
            user.value = null;

            await signup(fakeNewUser);
            await login({
                username: fakeNewUser.username,
                password: fakePassword
            });
        });

        it('refreshToken should update user accessToken', async () => {

            expect(user.value).toBeDefined();
            const accessToken = (user.value as ResponseUserAuthDTO)?.accessToken as string;
            expect(accessToken).toBeTruthy();

            expect(refreshToken).toBeDefined();
            expect(refreshToken).toBeInstanceOf(Function);

            const spy = vi.fn(refreshToken);
            await spy(accessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(accessToken);

            expect(user.value).toBeDefined();
            expect((user.value as ResponseUserAuthDTO)?.accessToken).toBeTruthy();

        }, {retry: retries});

        it('refreshToken should return null if invalid accessToken is provided', async () => {

            const fakeAccessToken = faker.word.sample(10);

            const spy = vi.fn(refreshToken);
            await spy(fakeAccessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(fakeAccessToken);

            expect(spy).toReturn();

        });

        it('refreshToken should return null if no accessToken is provided', async () => {

            const fakeAccessToken:string = '';

            const spy = vi.fn(refreshToken);
            await spy(fakeAccessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(fakeAccessToken);

            expect(spy).toReturn();
        });

        afterAll(() => {
            user.value = null;
        });

    });

});

/*
describe('User store tests', () => {


    it('getUser should update ref user by returning a ResponseUserAuthDTO', async () => {

        const accessToken = (user.value as ResponseUserAuthDTO)?.accessToken as string;

        expect(getUser).toBeDefined();
        expect(getUser).toBeInstanceOf(Function);

        const spy = vi.fn(getUser);
        await spy(accessToken);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(accessToken);

        expect(user.value).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
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
*/
