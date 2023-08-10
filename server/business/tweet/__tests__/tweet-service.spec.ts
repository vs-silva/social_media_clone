import {describe, it, vi, expect, beforeAll, afterAll} from "vitest";
import {faker} from "@faker-js/faker";
import Tweet from "../index";
import type {RequestTweetCreateDTO} from "../core/dtos/request-tweet-create.dto";
import type {TweetDTO} from "../core/dtos/tweet.dto";
import User from "../../user";
import type {UserDTO} from "../../user/core/dtos/user.dto";
import type {RequestUserRegisterDTO} from "../../user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../user/core/dtos/request-user-auth.dto";


describe('Tweet service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;

    let registeredUser: UserDTO | null;
    let user: UserDTO | null;

    const fakePassword = faker.internet.password();

    beforeAll(async () => {
        registeredUser = await User.registerUser(<RequestUserRegisterDTO> {
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: faker.internet.userName(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        });

        user = await User.authenticateUser(<RequestUserAuthDTO>{
            username: registeredUser?.username,
            password: fakePassword,
            accessTokenSecret: `${faker.word.words()}:${faker.word.words()}`,
            refreshTokenSecret: `${faker.word.words()}:${faker.word.words()}`
        });
    });


    describe('createTweet port tests', () => {

        it('createTweet should create a tweet on the data provider and return a TweetDTO', async () => {

            expect(Tweet.createTweet).toBeDefined();
            expect(Tweet.createTweet).toBeInstanceOf(Function);

            const blob = new Blob([faker.image.url()]);

            const fakeTweet = <RequestTweetCreateDTO>{
                userId: user?.id,
                text: faker.word.words(10),
                mediaFiles: [new File([blob], 'testImage.jpg')]
            };

            const spy = vi.spyOn(Tweet, 'createTweet');
            const result = await Tweet.createTweet(fakeTweet);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTweet);

            expect(result).not.toBeNull();
            expect(result).toBeTruthy();
            expect(result?.userId).toMatch(idRegex);

            expect(result).toStrictEqual(expect.objectContaining(<TweetDTO>{
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }));

        });

        it('createTweet should return null if required RequestTweetCreateDTO fields are not provided', async () => {

            const fakeTweet = <RequestTweetCreateDTO>{
                userId: user?.id,
                text: '',
            };

            const spy = vi.spyOn(Tweet, 'createTweet');
            const result = await Tweet.createTweet(fakeTweet);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTweet);

            expect(result).toBeNull();

        });

    });

    describe('getAllTweets port tests', () => {

        beforeAll(async () => {
            const blob = new Blob([faker.image.url()]);

            const fakeTweet = <RequestTweetCreateDTO>{
                userId: user?.id,
                text: faker.word.words(10),
                mediaFiles: [new File([blob], 'testImage.jpg')]
            };

            await Tweet.createTweet(fakeTweet);
        });

        it('getAllTweets should return a collection of TweetDTO', async () => {

            expect(Tweet.getAllTweets).toBeDefined();
            expect(Tweet.getAllTweets).toBeInstanceOf(Function);

            const spy = vi.spyOn(Tweet, 'getAllTweets');
            const result = await Tweet.getAllTweets();

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith();

            expect(result).toBeDefined();

            expect(result).toStrictEqual(expect.arrayContaining(<TweetDTO[]>[expect.objectContaining(<TweetDTO>{
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date)
            })]));

        });

    });

    afterAll(() => {
       registeredUser = null;
       user = null;
    });

});
