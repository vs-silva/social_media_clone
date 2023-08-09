import {describe, it, expect, vi, afterAll, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {RequestUserRegisterDTO} from "../../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../../server/business/user/core/dtos/response-user-auth.dto";
import type {RequestTweetCreateDTO} from "../../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import type {ResponseTweetDTO} from "../../../../server/business/tweet/core/dtos/response-tweet-dto";

describe.skip('Tweet store tests', () => {

    const retries: number = 3;

    setActivePinia(createPinia());

    const userStore = Store.useUserStore();
    const tweetStore = Store.useTweetStore();

    const { user } = storeToRefs(userStore);
    const { tweet, tweetsCollection } = storeToRefs(tweetStore);

    const { signup, login } = userStore;
    const { submitTweet, getAllTweets } = tweetStore;

    const fakePassword = faker.internet.password();

    const fakeNewUser: RequestUserRegisterDTO = {
        email: faker.internet.email(),
        password: fakePassword,
        repeatPassword: fakePassword,
        username: '',
        name: `${faker.person.firstName()} ${faker.person.lastName()}`
    };

    describe('submitTweet port tests', () => {

        beforeAll(async () => {
            fakeNewUser.username = faker.internet.userName();
            await signup(fakeNewUser);
        });

        it('submitTweet should allow logged user to post a tweet', async () => {

            expect(user.value).toBeDefined();
            expect(tweet.value).toBeDefined();

            const userAuthDTO: RequestUserAuthDTO = {
                username: fakeNewUser.username,
                password: fakeNewUser.password
            };

            await login(userAuthDTO);

            expect(user.value).toStrictEqual(expect.objectContaining(<ResponseUserAuthDTO>{
                id: expect.any(String),
                email: expect.any(String),
                username: expect.any(String),
                profileImage: expect.any(String),
                profileCreateDate: expect.any(String),
                profileLastUpdateDate: expect.any(String),
                accessToken: expect.any(String)
            }));

            const blob = new Blob([faker.image.url()]);

            const tweetRequestDTO = <RequestTweetCreateDTO>{
                userId: user.value?.id,
                text: faker.word.words(3),
                mediaFiles:  [new File([blob], 'testImage.jpg')]
            };

            const spy = vi.fn(submitTweet);
            await spy(tweetRequestDTO);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(tweetRequestDTO);

            expect(tweet.value).toStrictEqual(expect.objectContaining(<ResponseTweetDTO>{
                id: expect.any(String),
                userId: expect.any(String),
                text: expect.any(String),
                createdAt: expect.any(String),
                updatedAt: expect.any(String)
            }));

        }, { timeout: 30000, retry: retries });

        it('submitTweet should return if userId or tweet text are not provided', async () => {

            const blob = new Blob([faker.image.url()]);

            const tweetRequestDTO = <RequestTweetCreateDTO>{
                userId: '',
                text: '',
                mediaFiles:  [new File([blob], 'testImage.jpg')]
            };

            const spy = vi.fn(submitTweet);
            await spy(tweetRequestDTO);

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith(tweetRequestDTO);

            expect(spy).toReturn();

        });

        afterAll(async () => {
            user.value = null;
            tweet.value = null;
        });
    });

    describe('getAllTweets port tests', () => {

        beforeAll(async () => {
            fakeNewUser.username = faker.internet.userName();
            await signup(fakeNewUser);
        });

        it.skip('getAllTweets should return a ResponseTweetDTO[] collection', async () => {

            expect(user.value).toBeDefined();
            expect(tweetsCollection.value).toBeDefined();

            expect(getAllTweets).toBeDefined();
            expect(getAllTweets).toBeInstanceOf(Function);

            const userAuthDTO: RequestUserAuthDTO = {
                username: fakeNewUser.username,
                password: fakeNewUser.password
            };

            await login(userAuthDTO);

            const blob = new Blob([faker.image.url()]);

            const tweetRequestDTO = <RequestTweetCreateDTO>{
                userId: user.value?.id,
                text: faker.word.words(3),
                mediaFiles:  [new File([blob], 'testImage.jpg')]
            };

            await submitTweet(tweetRequestDTO);

            const spy = vi.fn(getAllTweets);
            await spy();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();

            expect(tweetsCollection.value).toStrictEqual(expect.arrayContaining(<ResponseTweetDTO[]>[expect.objectContaining(<ResponseTweetDTO>{
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

});
