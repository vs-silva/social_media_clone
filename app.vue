<template>
  <div :class="{'dark': darkMode}">
    <div class="bg-white dark:bg-dim-900">

      <div class="min-h-full">

        <div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5">

          <!-- left sidebar -->

          <div class="hidden md:block xs-col-span-1 xl-col-span-2 xl:col-span-2">
            <div class="sticky top-0">
              <left-sidebar-component />
            </div>
          </div>

          <!-- main content -->
          <!--<main class="col-span-12 md:col-span-8 xl:col-span-6 bg-red-500">
            <h1>abc</h1>
          </main> -->

          <!-- right sidebar -->

          <div class="col-span-12 md:block xl:col-span-4 md:col-span-3 bg-green-500">
            <div class="sticky top-0">
              <right-sidebar-component />
            </div>
          </div>

        </div>

      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "@vue/runtime-core";
import LeftSidebarComponent from "./components/left-sidebar-component/index.vue";
import RightSidebarComponent from "./components/right-sidebar-component/index.vue";

const darkMode = ref<boolean>(false);

</script>
