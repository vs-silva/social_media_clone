<template>
  <div class="p-3 hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300 border-b"
  :class="`${Transitions.useDefaultTransition()} ${Transitions.useTwitterBorderColor()}`"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import {Transitions} from "../../composables/transitions";

</script>

<style scoped>

</style>
