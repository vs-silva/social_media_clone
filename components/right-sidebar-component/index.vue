<template>
  <div class="flex flex-col">

    <!-- preview card: what's happening -->
    <right-sidebar-preview-card-component
      :title="`What's happening`"
      :showMoreTitle="`Show more`"
    >

    </right-sidebar-preview-card-component>

    <!-- preview card: who to follow -->
    <right-sidebar-preview-card-component
        :title="`Who to follow`"
        :showMoreTitle="`Show more`"
    >

    </right-sidebar-preview-card-component>


  </div>
</template>

<script setup lang="ts">
import RightSidebarPreviewCardComponent from "../right-sidebar-preview-card-component/index.vue";

</script>

<style scoped>

</style>
