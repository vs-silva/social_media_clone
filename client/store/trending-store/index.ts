
import {ref} from "@vue/runtime-core";
import type {TrendItemDTO} from "../../integration/trend/core/dtos/trend-item.dto";
export const TrendingStoreIdentifier = 'trending-store';

export function TrendingStore() {

    const trendingItems = ref<TrendItemDTO[] | null>(null);

    async function getAllTrendingItems(): Promise<void> {

        trendingItems.value = [
            {
                id: 'a470d734-b0b1-4843-9393-42eb4a9935aa',
                title: '#SCIENCE',
                count: '100.8k Tweets'
            },
            {
                id: '7d12e4b7-1dac-483f-b1cf-ae4b946359b8',
                title: '#JIU-JITSU',
                count: '40.2k Tweets'
            },
            {
                id: '5adc77e5-809b-4796-a1ac-9b6a2709cf22',
                title: '#UFC',
                count: '20k Tweets'
            }
        ];

    }

    return {
        trendingItems,
        getAllTrendingItems
    };
}
