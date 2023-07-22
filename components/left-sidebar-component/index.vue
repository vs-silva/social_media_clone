<template>
  <div class="h-screen flex flex-col">

    <div class="p-2 my-2 rounded-full hover:bg-blue-50 w-min
      dark:hover:bg-white/20" :class="Transitions.useDefaultTransition()">

      <nuxt-link to="/">
        <div class="w-8 h-8">
          <twitter-logo-component />
        </div>
      </nuxt-link>

    </div>

    <div class="mt-2 space-y-3">

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <home-icon />
        </template>
        <template v-slot:name>
          Home
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <hashtag-icon />
        </template>
        <template v-slot:name>
          Explore
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <bell-icon />
        </template>
        <template v-slot:name>
          Notifications
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <inbox-icon />
        </template>
        <template v-slot:name>
          Messages
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <bookmark-icon />
        </template>
        <template v-slot:name>
          Bookmarks
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <document-text-icon />
        </template>
        <template v-slot:name>
          Lists
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <user-icon />
        </template>
        <template v-slot:name>
          Profile
        </template>
      </left-sidebar-tab-component>

      <left-sidebar-tab-component>
        <template v-slot:icon>
          <ellipsis-horizontal-circle-icon />
        </template>
        <template v-slot:name>
          More
        </template>
      </left-sidebar-tab-component>

    </div>


  </div>
</template>

<script setup lang="ts">
import TwitterLogoComponent from "../twitter-logo-component/index.vue";
import LeftSidebarTabComponent from "../left-sidebar-tab-component/index.vue";
import {Transitions} from "../../composables/transitions";
import {HomeIcon} from "@heroicons/vue/24/solid";
import {BellIcon, UserIcon, DocumentTextIcon, InboxIcon, BookmarkIcon, HashtagIcon, EllipsisHorizontalCircleIcon} from "@heroicons/vue/24/outline";


</script>

<style scoped>

</style>
