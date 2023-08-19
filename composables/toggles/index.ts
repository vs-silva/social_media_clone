import {Ref} from "vue";

function useBooleanToggle(booleanRef: Ref<boolean>): void {
    booleanRef.value = !booleanRef.value;
}

export const Toggles = {
    useBooleanToggle
};
