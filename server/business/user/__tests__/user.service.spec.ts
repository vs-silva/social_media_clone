import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";

describe('User service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;

    describe('RegisterUser port tests', () => {

        const fakePassword = faker.internet.password();

        const fakeNewUser: RequestUserRegisterDTO = {
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: '',
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        };

        it('RegisterUser port should create a new user and ResponseUserDTO', async () => {

            fakeNewUser.username = faker.internet.userName();

            const spy = vi.spyOn(User, 'registerUser');
            const result = await User.registerUser(fakeNewUser);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toBeTruthy();
            expect(result?.id).toBeTruthy();
            expect(result?.id).toMatch(idRegex);

            expect(result).toStrictEqual(expect.objectContaining(<ResponseUserDTO>{
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
