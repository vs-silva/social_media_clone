<template>
  <div class="flex flex-col">

    <!-- preview card: what's happening -->
    <right-sidebar-preview-card-component
      :title="`What's happening`"
      :showMoreTitle="`Show more`"
    >

      <right-sidebar-preview-card-item-component v-if="props.trends" v-for="trend in props.trends" :key="trend.id" :id="trend.id">

        <div>
          <h2 class="font-bold text-gray-800 text-md dark:text-white">{{trend.title}}</h2>
          <p class="text-xs text-gray-400">{{trend.count}}</p>
        </div>

      </right-sidebar-preview-card-item-component>

    </right-sidebar-preview-card-component>


    <!-- preview card: who to follow -->
    <right-sidebar-preview-card-component
        :title="`Who to follow`"
        :showMoreTitle="`Show more`"
    >

      <right-sidebar-preview-card-item-component v-if="props.peopleTrends" v-for="person in props.peopleTrends" :key="person.id" :id="person.id">

        <div class="flex flex-row items-center justify-between p-2">

          <div class="flex flex-row">
            <img class="w-10 h-10 rounded-full" :src="person.image" :alt="person.name"/>

            <div class="flex flex-col ml-2">
              <h1 class="text-sm font-bold text-gray-900 dark:text-white">{{person.name}}</h1>
              <p class="text-xs text-gray-400">{{person.handle}}</p>
            </div>

          </div>

          <div class="flex h-full">
            <button class="px-4 py-2 font-bold text-xs text-white bg-black rounded-full dark:text-black dark:bg-white">Follow</button>
          </div>

        </div>

      </right-sidebar-preview-card-item-component>

    </right-sidebar-preview-card-component>


  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import RightSidebarPreviewCardComponent from "../right-sidebar-preview-card-component/index.vue";
import RightSidebarPreviewCardItemComponent from "../right-sidebar-preview-card-item-component/index.vue";
import type {TrendItemDTO} from "../../integration/trend/core/dtos/trend-item.dto";
import type {PersonItemDTO} from "../../integration/trend/core/dtos/person-item.dto";

const props = defineProps({
  trends: {
    type: Array as PropType<TrendItemDTO[] | null>,
    required: false,
    default: null
  },
  peopleTrends: {
    type: Array as PropType<PersonItemDTO[] | null>,
    required: false,
    default: null
  }
});


</script>

<style scoped>

</style>
