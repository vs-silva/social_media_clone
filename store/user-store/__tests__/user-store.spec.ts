import {describe, it, expect, vi, afterAll, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../server/business/user/core/dtos/response-user-register.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";

describe('Store: User store tests', () => {

    setActivePinia(createPinia());
    const userStore = Store.useUserStore();
    const { user } = storeToRefs(userStore);
    const { signup, login, renewAccessToken, refreshToken, getUser } = userStore;

    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: faker.internet.userName(),
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    it('sign up should take RequestUserRegisterDTO, perform the user registration', async () => {

        expect(signup).toBeDefined();
        expect(signup).toBeInstanceOf(Function);

        expect(user).toBeDefined();
        expect(user.value).toBeNull();

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

    it('login should allow a registered user to access the application by providing a accessToken', async () => {

        expect(user.value).toBeDefined();

        expect(login).toBeDefined();
        expect(login).toBeInstanceOf(Function);

        const userAuthDTO: RequestUserAuthDTO = {
            username: '',
            password: fakePassword
        };

        userAuthDTO.username = user.value?.username as string;

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

    });


    it('renewAccessToken should return if accessToken is not provided', async () => {

        const fakeAccessToken = '';

        const spy = vi.fn(renewAccessToken);
        await spy(fakeAccessToken);

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith(fakeAccessToken);

        expect(spy).toReturn();

    });

    it('refreshToken should update user accessToken', async () => {

        expect(user.value).toBeDefined();

        expect(refreshToken).toBeDefined();
        expect(refreshToken).toBeInstanceOf(Function);

        const spy = vi.fn(refreshToken);
        await spy();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith();

        expect(user.value).toBeDefined();
        expect((user.value as ResponseUserAuthDTO)?.accessToken).toBeTruthy();

    });

    it('getUser should update ref user by returning a ResponseUserAuthDTO', async () => {

        expect(user.value).toBeDefined();

        expect(getUser).toBeDefined();
        expect(getUser).toBeInstanceOf(Function);

        const spy = vi.fn(getUser);
        await spy();

        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith();

        expect(user.value).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
            id: expect.any(String),
            email: expect.any(String),
            username: expect.any(String),
            profileImage: expect.any(String),
            profileCreateDate: expect.any(String),
            profileLastUpdateDate: expect.any(String),
            accessToken: expect.any(String)
        }));

    }, {
        timeout: 30000,
        retry: 3
    });

    afterAll(() => {
        user.value = null;
    });

});
