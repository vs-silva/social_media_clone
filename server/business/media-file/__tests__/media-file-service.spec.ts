import {describe, it, vi, expect, beforeEach} from "vitest";
import {faker} from "@faker-js/faker";
import MediaFile from "../index";
import type {MediaFileCloudDTO} from "../core/dtos/media-file-cloud.dto";
import type {RequestMediaFileCreateDTO} from "../core/dtos/request-media-file-create.dto";
import type {MediaFileDTO} from "../core/dtos/media-file.dto";


describe('Media File service tests', () => {

    describe('uploadMediaFile port tests', () => {

        const idRegex = /^[a-fA-F0-9]{32}$/;
        const publicIdRegex = /^[a-zA-Z0-9]{20}$/;

        it('uploadMediaFile should upload file resource to cloud media provider and return MediaFileResourceEntity', async () => {

            const fakeImage = faker.image.url();

            const spy = vi.spyOn(MediaFile, 'uploadMediaFile');
            const result = await MediaFile.uploadMediaFile(fakeImage);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeImage);

            expect(result?.id).toMatch(idRegex);
            expect(result?.publicId).toMatch(publicIdRegex);
            expect(result?.url.trim()).not.toBeFalsy();

            expect(result).toStrictEqual(expect.objectContaining(<MediaFileCloudDTO>{
                id: expect.any(String),
                publicId: expect.any(String),
                width: expect.any(Number),
                height: expect.any(Number),
                format: expect.any(String),
                resourceType: expect.any(String),
                createdAt: expect.any(Date),
                url: expect.any(String)
            }));

        });


        it('uploadMediaFile should return null if file resource is not provided', async () => {

            const fakeImage = '  ';

            const spy = vi.spyOn(MediaFile, 'uploadMediaFile');
            const result = await MediaFile.uploadMediaFile(fakeImage);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeImage);

            expect(result).toBeNull();

        });

    });

    describe('createMediaFile port tests', () => {

        const idRegex = /\b[0-9a-f]{24}\b/;

        function generateFakeCloudProviderPublicId(): string {
            const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let result = '';

            while (result.length < 20) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                const randomChar = characters[randomIndex];
                result += randomChar;
            }

            if (/^[a-zA-Z0-9]{20}$/.test(result)) {
                return result;
            } else {
                return generateFakeCloudProviderPublicId();
            }
        }

        let fakeCloudProviderPublicId: string;

        beforeEach(() => {
            fakeCloudProviderPublicId = generateFakeCloudProviderPublicId();
        });


        it('createMedia should save a MediaFileCloudDTO on the dataProvider and Return MediaFileDTO', async () => {

            const fakeRequestCreateMediaFileDTO: RequestMediaFileCreateDTO = {
                userId: faker.database.mongodbObjectId(),
                providerPublicId: fakeCloudProviderPublicId,
                url: faker.image.url(),
                tweetId: faker.database.mongodbObjectId()
            };

            const spy = vi.spyOn(MediaFile, 'createMediaFile');
            const result = await MediaFile.createMediaFile(fakeRequestCreateMediaFileDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeRequestCreateMediaFileDTO);

            expect(result?.id).toMatch(idRegex);
            expect(result?.userId).toMatch(idRegex);
            expect(result?.tweetId).toMatch(idRegex);

            expect(result?.url.trim()).toBeTruthy();
            expect(result?.providerPublicId.trim()).toBeTruthy();

            expect(result?.userId).toEqual(fakeRequestCreateMediaFileDTO.userId);
            expect(result?.tweetId).toEqual(fakeRequestCreateMediaFileDTO.tweetId);

            expect(result).toStrictEqual(expect.objectContaining(<MediaFileDTO>{
                id: expect.any(String),
                userId: expect.any(String),
                tweetId: expect.any(String),
                providerPublicId: expect.any(String),
                url: expect.any(String),
                createAt: expect.any(Date),
                updatedAt: expect.any(Date)
            }));

        });

        it('createMedia should return Null if required MediaFileCloudDTO fields are not provided', async () => {

            const fakeRequestCreateMediaFileDTO: RequestMediaFileCreateDTO = {
                userId: faker.database.mongodbObjectId(),
                providerPublicId: fakeCloudProviderPublicId,
                url: ' ',
                tweetId: ' '
            };

            const spy = vi.spyOn(MediaFile, 'createMediaFile');
            const result = await MediaFile.createMediaFile(fakeRequestCreateMediaFileDTO);

            expect(spy).toHaveBeenCalledOnce();
            expect(spy).toHaveBeenCalledWith(fakeRequestCreateMediaFileDTO);

            expect(result).toBeNull();

        });

    });

});
