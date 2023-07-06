import {describe, it, vi, expect, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import Encrypter from "../index";

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

});
