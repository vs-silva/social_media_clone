import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../../user";
import Tweet from "../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {RequestTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import type {ResponseTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-create.dto";


describe('Integration: Tweet service tests', () => {

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


    describe('submitTweet port tests', () => {

        it('submitTweet should create a tweet and return a ResponseTweetCreateDTO', async () => {

            fakeNewUser.username = faker.internet.userName();
            const registeredUser = await User.signup(fakeNewUser);

            const requestPayload:RequestUserAuthDTO = {
                username: registeredUser?.username as string,
                password: fakeNewUser.password
            };

            const loggedInUser = await User.login(requestPayload);
            const accessToken = loggedInUser?.accessToken as string;
            expect(accessToken).toMatch(tokenRegex);

            await User.refreshToken(accessToken);

            const blob = new Blob([faker.image.url()]);

            const fakeTweet: RequestTweetCreateDTO = {
              userId: loggedInUser?.id as string,
              text: faker.word.words(3),
              mediaFiles: [new File([blob], 'testImage.jpg')]
            };

            const spy = vi.spyOn(Tweet, 'submitTweet');
            const result = await Tweet.submitTweet(fakeTweet);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTweet);

            expect(result).toBeTruthy();
            expect(result?.id).toBeTruthy();
            expect(result?.id).toMatch(idRegex);
            expect(result?.text).toEqual(fakeTweet.text);

            expect(result).toStrictEqual(expect.objectContaining(<ResponseTweetCreateDTO> {
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }));

        });

        it('submitTweet should return null if invalid user tries to submit a tweet', async () => {

            const fakeTweet: RequestTweetCreateDTO = {
                userId: faker.word.words(4),
                text: faker.word.words(3)
            };

            const spy = vi.spyOn(Tweet, 'submitTweet');
            const result = await Tweet.submitTweet(fakeTweet);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTweet);

            expect(result).toBeNull();

        });

    });
});
