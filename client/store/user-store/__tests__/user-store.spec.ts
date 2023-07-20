import {describe, it, expect, vi, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../../server/business/user/core/dtos/response-user-auth.dto";

describe('User store tests', () => {

    setActivePinia(createPinia());
    const userStore = Store.useUserStore();

    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: '',
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    describe('signup port tests', () => {

        const { user } = storeToRefs(userStore);

        beforeAll(() => {
           user.value = null;
        });

        it('sign up should take RequestUserRegisterDTO, perform the user registration', async () => {


            expect(user).toBeDefined();
            expect(user.value).toBeNull();

            const { signup } = userStore;
            expect(signup).toBeDefined();
            expect(signup).toBeInstanceOf(Function);

            fakeNewUser.username = faker.internet.userName();

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

        });

    });

    describe('login port tests', () => {

        const { user } = storeToRefs(userStore);

        beforeAll(() => {
            user.value = null;
        });

        it('login should take a RequestUserAuthDTO and allow a registered user to access the application by providing a accessToken', async () => {

            const { user } = storeToRefs(userStore);

            const { login, signup } = userStore;
            expect(login).toBeDefined();
            expect(login).toBeInstanceOf(Function);

            fakeNewUser.username = faker.internet.userName();

            await signup(fakeNewUser);

            const registeredUser: RequestUserAuthDTO = {
                username: user.value?.username as string,
                password: fakePassword
            };

            const spy = vi.fn(login);
            await spy(registeredUser);

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

    describe('renewAccessToken port tests', () => {

        const { user } = storeToRefs(userStore);

        beforeAll(() => {
            user.value = null;
        });

        it('renewAccessToken should return if ref user.value is null', async () => {

            const { renewAccessToken } = userStore;

            expect(renewAccessToken).toBeDefined();
            expect(renewAccessToken).toBeInstanceOf(Function);

            const spy = vi.fn(renewAccessToken);
            await spy();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();

            expect(user.value).toBeNull();
            expect(spy).toReturn();

        });

        it('renewAccessToken should return if accessToken is not present in ref user.value', async () => {

            const { renewAccessToken, signup } = userStore;

            fakeNewUser.username = faker.internet.userName();
            await signup(fakeNewUser);

            expect(user.value).toBeDefined();

            const spy = vi.fn(renewAccessToken);
            await spy();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();

            expect(spy).toReturn();

        });

        it('renewAccessToken should ask for user accessToken renew', async () => {

            const { renewAccessToken, login, signup } = userStore;

            fakeNewUser.username = faker.internet.userName();
            await signup(fakeNewUser);

            const registeredUser: RequestUserAuthDTO = {
                username: user.value?.username as string,
                password: fakePassword
            };

            await login(registeredUser);
            expect((user.value as ResponseUserAuthDTO).accessToken).toBeTruthy();

            const spy = vi.fn(renewAccessToken);
            await spy();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();
        });

    });

    describe('refreshToken port tests', () => {

        const { user } = storeToRefs(userStore);
        const { refreshToken,login, signup} = userStore;

        it('refreshToken should return null if invalid accessToken is provided', async () => {

            const fakeAccessToken = faker.word.sample(10);

            const spy = vi.fn(refreshToken);
            const result = await spy(fakeAccessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(fakeAccessToken);

            expect(spy).toReturn();
            expect(result).toBeUndefined();

        });

        it('refreshToken should update user accessToken', async () => {

            fakeNewUser.username = faker.internet.userName();
            await signup(fakeNewUser);

            const registeredUser: RequestUserAuthDTO = {
                username: user.value?.username as string,
                password: fakePassword
            };

            await login(registeredUser);
            const initialAccessToken = (user.value as ResponseUserAuthDTO).accessToken as string;
            expect(initialAccessToken.trim()).toBeTruthy();

            const spy = vi.fn(refreshToken);
            await spy(initialAccessToken);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(initialAccessToken);
        });


    });

    describe('getUser port test', () => {

        const { user } = storeToRefs(userStore);
        const { refreshToken,login, signup, getUser } = userStore;

        it('getUser should should update ref user.value by returning a ResponseUserAuthDTO', async () => {

            fakeNewUser.username = faker.internet.userName();
            await signup(fakeNewUser);

            const registeredUser: RequestUserAuthDTO = {
                username: user.value?.username as string,
                password: fakePassword
            };

            await login(registeredUser);
            const accessToken = (user.value as ResponseUserAuthDTO).accessToken as string
            await refreshToken(accessToken);

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

});
