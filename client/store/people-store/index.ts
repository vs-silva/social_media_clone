import {ref} from "@vue/runtime-core";
import type {PersonItemDTO} from "../../integration/trend/core/dtos/person-item.dto";

export const PeopleStoreIdentifier = 'people-store';

export function PeopleStore() {

    const peopleItems = ref<PersonItemDTO[] | null>(null);

    async function getAllPeopleToFollow(): Promise<void> {

        peopleItems.value = [
            {
                id: '9faadfa4-32cf-45c0-8929-f6c5ac2488dd',
                image: 'https://picsum.photos/200/200',
                name: 'Timothy Berners-Lee',
                handle: '@timothylee'
            },
            {
                id: 'a81aebd7-5963-4a28-b2bb-7fdf7bcbf5fc',
                image: 'https://picsum.photos/200/200',
                name: 'Tony Hawk',
                handle: '@sk8Tony'
            },
            {
                id: 'f6f475c2-781d-4752-bb06-78a3e3499122',
                image: 'https://picsum.photos/200/200',
                name: 'Chris Voss',
                handle: '@theBlackSwan'
            }
        ];
    }

    return {
        peopleItems,
        getAllPeopleToFollow
    };
}
