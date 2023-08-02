import {describe, it, expect, vi, afterAll, beforeAll} from "vitest";
import {createPinia, setActivePinia} from "pinia";
import {storeToRefs} from "pinia";
import Store from "../../index";
import type {TrendItemDTO} from "../../../integration/trend/core/dtos/trend-item.dto";

describe('Trending store tests', () => {

    setActivePinia(createPinia());

    const trendingStore = Store.useTrendingStore();
    const { getAllTrendingItems } = trendingStore;
    const {trendingItems} = storeToRefs(trendingStore);

    describe('getAllTrendingItems port tests', () => {

        beforeAll(() => {
            trendingItems.value = null;
        });

        it('getAllTrendingItems should return a collection of TrendItemDTO', async () => {

            expect(trendingItems).toBeDefined();
            expect(trendingItems.value).toBeNull();

            expect(getAllTrendingItems).toBeDefined();
            expect(getAllTrendingItems).toBeInstanceOf(Function);

            const spy = vi.fn(getAllTrendingItems);
            await spy();

            expect(spy).toHaveBeenCalled();
            expect(spy).toHaveBeenCalledWith();

            expect(trendingItems.value).toBeDefined();

            expect(trendingItems.value).toStrictEqual(expect.arrayContaining(<TrendItemDTO[]>[expect.objectContaining(<TrendItemDTO>{
                id: expect.any(String),
                title: expect.any(String),
                count: expect.any(String),
            })]));

        });

        afterAll(() => {
            trendingItems.value = null;
        });

    });


});
