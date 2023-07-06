import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import Token from "../index";
import type {RequestTokenGenerateDTO} from "~/server/business/token/core/dtos/request-token-generate.dto";
import type {TokenDTO} from "../core/dtos/token.dto";

describe('Token service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const tokenRegex = /[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+/;

    describe('generateTokens port tests', () => {

        const fakeRequestTokenGenerateDTO: RequestTokenGenerateDTO = {
            userId: faker.database.mongodbObjectId(),
            accessTokenSecret: `${faker.word.words(1)}_${faker.word.words(1)}`,
            refreshTokenSecret: `${faker.word.words(1)}_${faker.word.words(1)}`
        };

        it('generateTokens should create access and refresh tokens and return TokenDTO', async () => {

            const spy = vi.spyOn(Token, 'generateTokens');
            const result = await Token.generateTokens(fakeRequestTokenGenerateDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeRequestTokenGenerateDTO);

            expect(result).toBeTruthy();

            expect(result?.userId).toMatch(idRegex);
            expect(result?.refreshTokenId).toMatch(idRegex);
            expect(result?.accessToken).toMatch(tokenRegex);
            expect(result?.refreshToken).toMatch(tokenRegex);

            expect(result).toStrictEqual(expect.objectContaining(<TokenDTO>{
                userId: expect.any(String),
                refreshTokenId: expect.any(String),
                accessToken: expect.any(String),
                refreshToken: expect.any(String),
                refreshTokenCreatedAt: expect.any(Date),
                refreshTokenUpdatedAt: expect.any(Date),
            }));

        });

    });

    describe('getRefreshTokenByToken port tests', () => {

        it.todo('getRefreshTokenByToken should return a TokenDTO');
        it.todo('getRefreshTokenByToken should return null if refreshToken is not found on data provider');
        it.todo('getRefreshTokenByToken should return null if refreshToken is not provided');

    });
});
