import {describe, it, vi, expect} from "vitest";
import {faker} from "@faker-js/faker";
import Tweet from "../index";
import type {RequestTweetCreateDTO} from "../core/dtos/request-tweet-create.dto";
import type {TweetDTO} from "../core/dtos/tweet.dto";

describe('Tweet service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;

    describe('createTweet port tests', () => {

        const fakeTweet: RequestTweetCreateDTO = {
            userId: faker.database.mongodbObjectId(),
            text: faker.word.words(10)
        };

        it('createTweet should create a tweet on the data provider and return a TweetDTO', async () => {

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

            fakeTweet.text = '';

            const spy = vi.spyOn(Tweet, 'createTweet');
            const result = await Tweet.createTweet(fakeTweet);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTweet);

            expect(result).toBeNull();

        });

    });

    describe('getAllTweets port tests', () => {

        const fakeTweet: RequestTweetCreateDTO = {
            userId: faker.database.mongodbObjectId(),
            text: faker.word.words(5)
        };

        it('getAllTweets should return a collection of TweetDTO', async () => {

            await Tweet.createTweet(fakeTweet);

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




});
