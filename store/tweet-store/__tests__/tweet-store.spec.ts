import {describe, it, expect, vi, afterAll, beforeAll} from "vitest";
import {faker} from "@faker-js/faker";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {RequestUserRegisterDTO} from "../../../server/business/user/core/dtos/request-user-register.dto";
import type {RequestUserAuthDTO} from "../../../server/business/user/core/dtos/request-user-auth.dto";
import type {ResponseUserAuthDTO} from "../../../server/business/user/core/dtos/response-user-auth.dto";
import type {RequestTweetCreateDTO} from "../../../server/business/tweet/core/dtos/request-tweet-create.dto";
import type {ResponseTweetDTO} from "../../../server/business/tweet/core/dtos/response-tweet-dto";

describe('Store: Tweet store tests', () => {

    const retries: number = 3;
    const timeout: number = 30000;

    setActivePinia(createPinia());

    const userStore = Store.useUserStore();
    const tweetStore = Store.useTweetStore();

    const { user } = storeToRefs(userStore);
    const { tweet, tweetsCollection } = storeToRefs(tweetStore);

    const { signup, login } = userStore;
    const { submitTweet, getAllTweets } = tweetStore;

    const fakePassword = faker.internet.password();

    beforeAll(async () => {
        await signup(<RequestUserRegisterDTO>{
            email: faker.internet.email(),
            password: fakePassword,
            repeatPassword: fakePassword,
            username: faker.internet.userName(),
            name: `${faker.person.firstName()} ${faker.person.lastName()}`
        });

        await login(<RequestUserAuthDTO>{
            username: user.value?.username,
            password: fakePassword
        });
    })

    it('submitTweet should allow logged user to post a tweet', async () => {

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

    }, { timeout: timeout, retry: retries });

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

    it('getAllTweets should return a ResponseTweetDTO[] collection', async () => {

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

    }, { timeout: timeout, retry: retries });

});
