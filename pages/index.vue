<template>
  <div>
    <main-section-component
        :title="`Home`"
        :loading="loading">

      <tweet-form-component />

    </main-section-component>
  </div>
</template>

<script setup lang="ts">

import MainSectionComponent from "../components/main-section-component/index.vue";
import TweetFormComponent from "../components/tweet-form-component/index.vue";

const loading = ref<boolean>(false);


</script>



<style scoped>

</style>
