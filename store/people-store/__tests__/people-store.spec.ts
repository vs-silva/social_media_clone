import {describe, it, expect, vi, afterAll, beforeAll} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {PersonItemDTO} from "../../../integration/trend/core/dtos/person-item.dto";

describe('People store tests', () => {

    setActivePinia(createPinia());

    const peopleStore = Store.usePeopleStore();
    const { getAllPeopleToFollow } = peopleStore;
    const {peopleItems} = storeToRefs(peopleStore);

    describe('getAllPeopleToFollow port tests', () => {

        beforeAll(() => {
            peopleItems.value = null;
        });

        it('getAllPeopleToFollow should return a collection of PersonItemDTO', async () => {

            expect(peopleItems).toBeDefined();
            expect(peopleItems.value).toBeNull();

            expect(getAllPeopleToFollow).toBeDefined();
            expect(getAllPeopleToFollow).toBeInstanceOf(Function);

            const spy = vi.fn(getAllPeopleToFollow);
            await spy();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();

            expect(peopleItems.value).toBeDefined();

            expect(peopleItems.value).toStrictEqual(expect.arrayContaining(<PersonItemDTO[]>[expect.objectContaining(<PersonItemDTO>{
                id: expect.any(String),
                image: expect.any(String),
                name: expect.any(String),
                handle: expect.any(String)
            })]));
        });


        afterAll(() => {
            peopleItems.value = null;
        });

    });

});
