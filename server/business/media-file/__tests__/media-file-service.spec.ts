import {describe, it, vi, expect} from "vitest";
import {faker} from "@faker-js/faker";
import MediaFile from "../index";
import type {MediaFileCloudDTO} from "../core/dtos/media-file-cloud.dto";


describe('Media File service tests', () => {

    const idRegex = /^[a-fA-F0-9]{32}$/;
    const publicIdRegex = /^[a-zA-Z0-9]{20}$/;

    describe('uploadMediaFile port tests', () => {

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

});