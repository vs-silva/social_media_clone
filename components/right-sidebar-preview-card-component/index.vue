<template>
  <div class="m-2 border rounded-2xl bg-gray-50 dark:bg-dim-700 overflow-hidden">

    <h1 class="p-3 text-xl font-extrabold text-gray-900 border-b dark:text-white" :class="Transitions.useTwitterBorderColor()">
      {{props.title}}
    </h1>

    <slot></slot>

    <div class="p-3 text-sm text-blue-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-dim-300" :class="Transitions.useDefaultTransition()">
      {{props.showMoreTitle}}
    </div>

  </div>
</template>


<script setup lang="ts">
import {Transitions} from "../../composables/transitions";

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  showMoreTitle: {
    type: String,
    required: false,
    default: ''
  }
});

</script>


<style scoped>

</style>
