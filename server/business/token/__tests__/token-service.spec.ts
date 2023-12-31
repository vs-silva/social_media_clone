import {describe, expect, it, vi} from "vitest";
import {faker} from "@faker-js/faker";
import Token from "../index";
import type {RequestTokenGenerateDTO} from "../core/dtos/request-token-generate.dto";
import type {TokenDTO} from "../core/dtos/token.dto";
import type {RequestTokenVerifyDTO} from "../core/dtos/request-token-verify.dto";
import type {ResponseTokenAccessVerifyDTO} from "../core/dtos/response-token-access-verify.dto";

describe('Token service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;
    const tokenRegex = /[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+?\.[a-zA-Z0-9_-]+/;

    const fakeRequestTokenGenerateDTO: RequestTokenGenerateDTO = {
        userId: faker.database.mongodbObjectId(),
        accessTokenSecret: `${faker.word.words(1)}_${faker.word.words(1)}`,
        refreshTokenSecret: `${faker.word.words(1)}_${faker.word.words(1)}`
    };

    describe('generateTokens port tests', () => {

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
                refreshTokenUpdatedAt: expect.any(Date)
            }));

        });

    });

    describe('getRefreshTokenByToken port tests', () => {

        it('getRefreshTokenByToken should return a TokenDTO', async () => {

            const token = await Token.generateTokens(fakeRequestTokenGenerateDTO);

            const spy = vi.spyOn(Token, 'getRefreshTokenByToken');
            const result = await Token.getRefreshTokenByToken(token?.refreshToken as string);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(token?.refreshToken as string);

            expect(result).toBeTruthy();

            expect(result).toStrictEqual(expect.objectContaining(<TokenDTO>{
                userId: expect.any(String),
                refreshTokenId: expect.any(String),
                refreshToken: expect.any(String),
                refreshTokenCreatedAt: expect.any(Date),
                refreshTokenUpdatedAt: expect.any(Date)
            }));
        });

        it('getRefreshTokenByToken should return null if refreshToken is not found on data provider', async () => {

            const fakeRefreshToken = `${faker.word.words(1)}_${faker.word.words(1)}`;

            const spy = vi.spyOn(Token, 'getRefreshTokenByToken');
            const result = await Token.getRefreshTokenByToken(fakeRefreshToken);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeRefreshToken);

            expect(result).toBeNull();
        });

        it('getRefreshTokenByToken should return null if refreshToken is not provided', async () => {

            const spy = vi.spyOn(Token, 'getRefreshTokenByToken');
            const result = await Token.getRefreshTokenByToken('');

            expect(spy).toHaveBeenCalledOnce();
            expect(result).toBeNull();
        });

    });

    describe('verifyToken port tests', () => {

        it('verifyToken should verify provided RequestTokenVerifyDTO and return TokenDTO', async () => {

            fakeRequestTokenGenerateDTO.userId =  faker.database.mongodbObjectId();
            const token = await Token.generateTokens(fakeRequestTokenGenerateDTO);

            expect(token?.refreshTokenId.trim()).toBeTruthy();
            expect(token?.refreshToken.trim()).toBeTruthy();

            const fakeTokenVerifyRequestDTO: RequestTokenVerifyDTO = {
              token: token?.refreshToken as string,
              tokenSecret: fakeRequestTokenGenerateDTO.refreshTokenSecret
            };

            const spy = vi.spyOn(Token, 'verifyToken');
            const result = await Token.verifyToken(fakeTokenVerifyRequestDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTokenVerifyRequestDTO);

            expect(result).toStrictEqual(expect.objectContaining(<TokenDTO>{
                userId: expect.any(String),
                refreshTokenId: expect.any(String),
                refreshToken: expect.any(String),
                refreshTokenCreatedAt: expect.any(Date),
                refreshTokenUpdatedAt: expect.any(Date),
                refreshExpireAtDate: expect.any(Date),
                isValid: expect.any(Boolean)
            }));

        });

        it('verifyToken should return Null if provided token is invalid', async () => {

            const fakeTokenVerifyRequestDTO: RequestTokenVerifyDTO = {
                token: `${faker.word.words(1)}_${faker.word.words(1)}`,
                tokenSecret:  `${faker.word.words(1)}_${faker.word.words(1)}`
            };

            const spy = vi.spyOn(Token, 'verifyToken');
            const result = await Token.verifyToken(fakeTokenVerifyRequestDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTokenVerifyRequestDTO);

            expect(result).toBeNull();
        });

        it('verifyToken should return Null if required fields are not provided', async () => {

            const fakeTokenVerifyRequestDTO: RequestTokenVerifyDTO = {
              token: ' ',
              tokenSecret:  `${faker.word.words(1)}_${faker.word.words(1)}`
            };

            const spy = vi.spyOn(Token, 'verifyToken');
            const result = await Token.verifyToken(fakeTokenVerifyRequestDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTokenVerifyRequestDTO);

            expect(result).toBeNull();
        });

    });

    describe('verifyAccessToken port tests', async () => {

        it('verifyAccessToken should return ResponseTokenAccessVerifyDTO is provided accessToken in the RequestTokenVerifyDTO is valid', async () => {

            fakeRequestTokenGenerateDTO.userId =  faker.database.mongodbObjectId();
            const token = await Token.generateTokens(fakeRequestTokenGenerateDTO);

            expect(token?.refreshTokenId.trim()).toBeTruthy();
            expect(token?.accessToken?.trim()).toBeTruthy();

            const fakeTokenVerifyRequestDTO: RequestTokenVerifyDTO = {
                token: token?.accessToken as string,
                tokenSecret: fakeRequestTokenGenerateDTO.accessTokenSecret
            };

            const spy = vi.spyOn(Token, 'verifyAccessToken');
            const result = await Token.verifyAccessToken(fakeTokenVerifyRequestDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTokenVerifyRequestDTO);

            expect(result).toStrictEqual(expect.objectContaining(<ResponseTokenAccessVerifyDTO>{
                userId: expect.any(String),
                createdAt: expect.any(Date),
                expireAt: expect.any(Date),
                isValid: expect.any(Boolean)
            }));
        });

        it('verifyAccessToken should return Null if provided token is invalid', async () => {

            const fakeTokenVerifyRequestDTO: RequestTokenVerifyDTO = {
                token: `${faker.word.words(1)}_${faker.word.words(1)}`,
                tokenSecret:  `${faker.word.words(1)}_${faker.word.words(1)}`
            };

            const spy = vi.spyOn(Token, 'verifyAccessToken');
            const result = await Token.verifyAccessToken(fakeTokenVerifyRequestDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTokenVerifyRequestDTO);

            expect(result).toBeNull();
        });


        it('verifyAccessToken should return Null if required fields are not provided', async () => {

            const fakeTokenVerifyRequestDTO: RequestTokenVerifyDTO = {
                token: ' ',
                tokenSecret:  `${faker.word.words(1)}_${faker.word.words(1)}`
            };

            const spy = vi.spyOn(Token, 'verifyAccessToken');
            const result = await Token.verifyAccessToken(fakeTokenVerifyRequestDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeTokenVerifyRequestDTO);

            expect(result).toBeNull();
        });

    });
});
