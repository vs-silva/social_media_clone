<template>
  <div class="border-x"
       :class="Transitions.useTwitterBorderColor()"
  >

    <div class="sticky top-0 px-4 py-3 bg-white/80 backdrop-blur-md dark:bg-dim-900/80">
      <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100">{{props.title}}</h2>
    </div>

    <div v-if="props.loading"
         class="flex items-center justify-center p-4 border-b"
         :class="Transitions.useTwitterBorderColor()"
    >
      <spinner-component />
    </div>

    <div v-else>
      <slot></slot>
    </div>


  </div>
</template>

<script setup lang="ts">
import SpinnerComponent from "../spinner-component/index.vue";
import {Transitions} from "../../composables/transitions";

const props = defineProps({
  title: {
    type: String,
    required: false,
    default: ''
  },
  loading: {
    type: Boolean,
    required: false,
    default: false
  }
});

</script>

<style scoped>

</style>
