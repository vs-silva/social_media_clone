import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";
import User from "../index";

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

        it('signup should create take a RequestUserAuthDTO create a new user and return a ResponseUserRegisterDTO', async () => {

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

});
