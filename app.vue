<template>
  <div :class="{'dark': darkMode}">
    <div class="bg-white dark:bg-dim-900">

      <auth-loading-animation-component v-if="loading"/>

      <!-- start app -->
      <div v-if="user" class="min-h-full">

        <div class="grid grid-cols-12 mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:gap-5">

          <!-- left sidebar -->

          <div class="hidden md:block xs-col-span-1 xl-col-span-2 xl:col-span-2">
            <div class="sticky top-0">
              <left-sidebar-component />
            </div>
          </div>

          <!-- main content -->
          <main class="col-span-12 md:col-span-8 xl:col-span-6">
            <router-view />
          </main>

          <!-- right sidebar -->

          <div class="hidden col-span-12 md:block xl:col-span-4 md:col-span-3">
            <div class="sticky top-0">
              <right-sidebar-component
                :trends="trendingItems"
                :peopleTrends="peopleItems"
              />
            </div>
          </div>

        </div>

      </div>
      <!-- end app -->

      <!-- start auth -->
      <auth-component v-else/>
      <!-- end auth -->

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, onDeactivated} from "@vue/runtime-core";
import Store from "./client/store";
import {storeToRefs} from "pinia";
import LeftSidebarComponent from "./components/left-sidebar-component/index.vue";
import RightSidebarComponent from "./components/right-sidebar-component/index.vue";
import AuthComponent from "./components/auth-component/index.vue";
import AuthLoadingAnimationComponent from "./components/auth-loading-animation-component/index.vue";
import EventbusEngine from "./client/engines/eventbus-engine";
import {UserServiceEventTypeConstants} from "./client/integration/user/core/constants/user-service-event-type.constants";

const darkMode = ref<boolean>(false);
const loading = ref<boolean>(false);

const {useTrendingStore, usePeopleStore, useUserStore} = Store;

const trendingStore = useTrendingStore();
const peopleStore = usePeopleStore();
const userStore = useUserStore();

const { trendingItems } = storeToRefs(trendingStore);
const { getAllTrendingItems } = trendingStore;

const { peopleItems } = storeToRefs(peopleStore);
const { getAllPeopleToFollow } = peopleStore;

const { refreshToken } = userStore;
const { user } = storeToRefs(userStore);

getAllTrendingItems();
getAllPeopleToFollow();

onBeforeMount(async () => {
  EventbusEngine.on(UserServiceEventTypeConstants.USER_SERVICE_REQUEST_STARTED, () => {
    loading.value = true;
  });

  EventbusEngine.on(UserServiceEventTypeConstants.USER_SERVICE_REQUEST_ENDED, () => {
    loading.value = false;
  });

  EventbusEngine.on(UserServiceEventTypeConstants.USER_SERVICE_REQUEST_FAILED, () => {
    loading.value = false;
  });

  await refreshToken();
});

onDeactivated(() => {
  EventbusEngine.off(UserServiceEventTypeConstants.USER_SERVICE_REQUEST_STARTED);
  EventbusEngine.off(UserServiceEventTypeConstants.USER_SERVICE_REQUEST_ENDED);
  EventbusEngine.off(UserServiceEventTypeConstants.USER_SERVICE_REQUEST_FAILED);
});

</script>
