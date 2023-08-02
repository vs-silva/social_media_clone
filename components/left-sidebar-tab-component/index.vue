<template>
  <nuxt-link to="#"
             class="flex items-center p-3 w-min rounded-full text-black hover:bg-gray-200 dark:hover:bg-dim-200 dark:text-white"
             :class="Transitions.useDefaultTransition()">

    <div class="w-6 h-6 text-dark" :class="Transitions.useDefaultTransition()">
      <slot name="icon"></slot>
    </div>

    <div class="hidden ml-4 text-xl xl:block"
         :class="textClasses">
      <slot name="name"></slot>
    </div>

  </nuxt-link>
</template>

<script setup lang="ts">
import {Transitions} from "../../composables/transitions";

const props = defineProps({
  active: {
    type: Boolean,
    required: false,
    default: false
  }
});

const textClasses = computed(() => props.active ? 'font-semibold': 'font-normal');

</script>

<style scoped>

</style>
