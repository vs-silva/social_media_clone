import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import User from "../../user";
import Tweet from "../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {RequestTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import type {ResponseTweetDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-dto";

describe('Integration: Tweet service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: faker.internet.userName(),
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    describe('submitTweet port tests', () => {


        it('submitTweet should create a tweet and return a ResponseTweetDto', async () => {

            const registeredUser = await User.signup(fakeNewUser);
            expect(registeredUser?.username).toBeDefined();

            const loggedUser = await User.login(<RequestUserAuthDTO>{
                username: registeredUser?.username,
                password: fakePassword
            });

            expect(loggedUser).toBeDefined();
            expect(loggedUser?.accessToken).toBeDefined();

            await User.refreshToken();

            const blob = new Blob([faker.image.url()]);

            const fakeTweet: RequestTweetCreateDTO = {
              userId: loggedUser?.id as string,
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

            expect(result).toStrictEqual(expect.objectContaining(<ResponseTweetDTO> {
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            }));


        }, {retry: 3});

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

    describe('getAllTweets port tests', () => {

        it('getAllTweets should return a ResponseTweetDTO[] collection', async () => {

            const user = await User.signup(fakeNewUser);
            expect(user?.username).toBeDefined();

            const loggedUser = await User.login(<RequestUserAuthDTO>{
                username: user?.username,
                password: fakePassword
            });

            expect(loggedUser).toBeDefined();
            expect(loggedUser?.accessToken).toBeDefined();

            await User.refreshToken();

            const blob = new Blob([faker.image.url()]);

            const fakeTweet: RequestTweetCreateDTO = {
                userId: loggedUser?.id as string,
                text: faker.word.words(3),
                mediaFiles: [new File([blob], 'testImage.jpg')]
            };

            await Tweet.submitTweet(fakeTweet);

            const spy = vi.spyOn(Tweet, 'getAllTweets');
            const result = await Tweet.getAllTweets();

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();

            expect(result).toStrictEqual(expect.arrayContaining(<ResponseTweetDTO[]>[expect.objectContaining(<ResponseTweetDTO>{
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })]));
        });


    });
});
