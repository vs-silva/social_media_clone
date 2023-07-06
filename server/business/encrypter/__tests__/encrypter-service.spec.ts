import {describe, it, vi, expect, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import Encrypter from "../index";
import {RequestUserRegisterDTO} from "~/server/business/user/core/dtos/request-user-register.dto";
import type {UserDTO} from "../../user/core/dtos/user.dto";
import User from "../../user";

describe('Encrypter service tests', () => {

    const hashedPasswordRegex = /\$2b\$10\$[./A-Za-z0-9]{53}/;

    describe('hashPassword port tests', () => {

        let fakePassword: string | null;

        it('hashPassword should return a hashed version of the provided password', () => {

            fakePassword = faker.internet.password();

            const spy = vi.spyOn(Encrypter, 'hashPassword');
            const result = Encrypter.hashPassword(fakePassword);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakePassword);

            expect(result?.trim()).toBeTruthy();
            expect(result?.trim()).toMatch(hashedPasswordRegex);

        });

        it('hashPassword should return null if no string or empty string is provided as password', () => {

            const fakePassword = ' ';

            const spy = vi.spyOn(Encrypter, 'hashPassword');
            const result = Encrypter.hashPassword(fakePassword);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakePassword);

            expect(result).toBeNull();

        });

    });

    describe('isPasswordValid port tests', () => {

        const fakePassword = faker.internet.password();

        const fakeNewUser: RequestUserRegisterDTO = {
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: faker.internet.userName(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        };

        let user: UserDTO | null;

        beforeAll(async () => {
            user = await User.registerUser(fakeNewUser);
        });

        it('isPasswordValid should return true if provided password exists in data provider', async () => {

            const spy = vi.spyOn(Encrypter, 'isPasswordValid');
            const result = await Encrypter.isPasswordValid(fakePassword, user?.password as string);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakePassword, user?.password as string);

            expect(result).toBeTruthy();
            expect(result).toEqual(true);
        });

        it('isPasswordValid should return false if provided password does not exists in data provider', async () => {

            const fakePass = faker.internet.password();

            const spy = vi.spyOn(Encrypter, 'isPasswordValid');
            const result = await Encrypter.isPasswordValid(fakePass, user?.password as string);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakePass, user?.password as string);

            expect(result).toBeFalsy();
            expect(result).toEqual(false);
        });

        it('isPasswordValid should return NULL if any of the provided values is an empty string', async () => {

            const fakePassword = ' ';
            const result = await Encrypter.isPasswordValid(fakePassword, user?.password as string);

            expect(result).toBeNull();
        });

    });

});
