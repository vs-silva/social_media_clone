import {afterAll, beforeAll, describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../../user";
import Tweet from "../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {RequestTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import type {ResponseTweetDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-dto";
import type {ResponseUserRegisterDTO} from "../../../../server/business/user/core/dtos/response-user-register.dto";

describe.skip('Integration: Tweet service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const fakePassword = faker.internet.password();

    const blob = new Blob([faker.image.url()]);

    const fakeTweet: RequestTweetCreateDTO = {
        userId: '',
        text: faker.word.words(3),
        mediaFiles: [new File([blob], 'testImage.jpg')]
    };

    let user: ResponseUserRegisterDTO | null;

    beforeAll(async () => {

        const registeredUser = await User.signup(<RequestUserRegisterDTO>{
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: faker.internet.userName(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        });

        user = await User.login(<RequestUserAuthDTO>{
            username: registeredUser?.username,
            password: fakePassword
        });

        await User.refreshToken();

    });

    describe('submitTweet port tests', () => {

        it('submitTweet should create a tweet and return a ResponseTweetDTO', async () => {

            expect(user).toBeDefined();

            expect(Tweet.submitTweet).toBeDefined();
            expect(Tweet.submitTweet).toBeInstanceOf(Function);

            fakeTweet.userId = user?.id as string;

            const spy = vi.spyOn(Tweet, 'submitTweet');
            const result = await Tweet.submitTweet(fakeTweet);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTweet);

            expect(result).toBeDefined();
            expect(result?.id).toBeTruthy();
            expect(result?.id).toMatch(idRegex);
            expect(result?.text).toEqual(fakeTweet.text);

            expect(result).toStrictEqual(expect.objectContaining(<ResponseTweetDTO> {
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }));

        }, {
            timeout: 30000,
            retry: 3
        });

    });

    describe('getAllTweets port tests', () => {

        it('getAllTweets should return a ResponseTweetDTO[] collection', async () => {

            expect(user).toBeDefined();

            expect(Tweet.getAllTweets).toBeDefined();
            expect(Tweet.getAllTweets).toBeInstanceOf(Function);

            fakeTweet.userId = user?.id as string;

            await Tweet.submitTweet(fakeTweet);

            const spy = vi.spyOn(Tweet, 'getAllTweets');
            const result = await Tweet.getAllTweets();

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();

            expect(result).toStrictEqual(expect.arrayContaining(<ResponseTweetDTO[]>[expect.objectContaining(<ResponseTweetDTO>{
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })]));
        }, {
            timeout: 30000,
            retry: 3
        });

    });

    afterAll(() => {
        user = null;
    });

});
