<template>
  <div>
    <main-section-component
        :title="`Home`"
        :loading="loading">
      Content
    </main-section-component>
  </div>
</template>

<script setup lang="ts">
import MainSectionComponent from "../components/main-section-component/index.vue";

const loading = ref<boolean>(false);

</script>



<style scoped>

</style>
