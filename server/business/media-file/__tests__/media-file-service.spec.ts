import {describe, it, vi, expect} from "vitest";
import {faker} from "@faker-js/faker";
import MediaFile from "../index";

describe('Media File service tests', () => {

    const idRegex = /\b[0-9a-f]{24}\b/;

    describe('uploadMediaFile port tests', () => {

        it.todo('uploadMediaFile should upload file resource to cloud media provider and return MediaFileResourceEntity');
        it.todo('uploadMediaFile should return null if file resource is not provided');

    });

});
