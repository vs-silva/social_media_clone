<template>
  <button
    class="flex justify-center text-white bg-blue-400 rounded-full
    hover:bg-blue-500 font-sm disabled:bg-blue-300
    disabled:cursor-not-allowed"
    :disabled="props.disabled"
    :class="`${setPaddingClass(props.size as string)} ${setWidthClass(props.liquid as boolean)}`"
    @click.prevent="(event) => emit(ButtonComponentEventTypeConstants.CLICK, event)"
  >
    <span :class="`${setFontClass(props.size as string)}`">
      <slot></slot>
    </span>
  </button>

</template>

<script setup lang="ts">
import {ButtonComponentEventTypeConstants} from "./constants/button-component-event-type.constants";

const emit = defineEmits([
  ButtonComponentEventTypeConstants.CLICK
]);

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false
  },
  size: {
    type: String,
    required: false,
    default: 'md'
  },
  liquid: {
    type: Boolean,
    required: false,
    default: false
  }
});

function setPaddingClass(size: string): string {

  const options = {
    sm: 'px-3 py-2',
    md: 'px-3 py-3',
    lg: 'px-4 py-3'
  };

  return options[size];
}

function setFontClass(size: string): string {

  const options = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-md'
  };

  return options[size];
}


function setWidthClass(liquid: boolean): string {
  return liquid ? 'w-full': 'w-min';
}



</script>

<style scoped>

</style>
