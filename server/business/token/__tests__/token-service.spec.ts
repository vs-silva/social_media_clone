import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import Token from "../index";
import type {RequestTokenGenerateDTO} from "~/server/business/token/core/dtos/request-token-generate.dto";
import type {TokenDTO} from "../core/dtos/token.dto";

describe('Token service tests', () => {

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

            expect(result?.accessToken).toMatch(tokenRegex);
            expect(result?.refreshToken).toMatch(tokenRegex);

            expect(result).toStrictEqual(expect.objectContaining(<TokenDTO>{
                accessToken: expect.any(String),
                refreshToken: expect.any(String)
            }));

        });

    });
});
