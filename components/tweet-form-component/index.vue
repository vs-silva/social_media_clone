<template>
  <div>

    <div v-if="loading" class="flex items-center justify-center p-6">
      <spinner-component />
    </div>

    <div v-else>
      <tweet-form-input-component
          :profileImage="profileImage"
          :textPlaceholder="`What's happening ?`"
          @submit-tweet="(payload) => submitTweet({
        userId: userId,
        text: payload?.tweetText as string,
        mediaFiles: [payload?.mediaFile as File]
      })"
      />
    </div>

  </div>
</template>

<script setup lang="ts">
import {onBeforeMount, onDeactivated} from "@vue/runtime-core";
import EventbusEngine from "../../client/engines/eventbus-engine";
import {TweetServiceEventTypeConstants} from "../../client/integration/tweet/core/constants/tweet-service-event-type.constants";
import Store from "../../client/store";
import {storeToRefs} from "pinia";
import SpinnerComponent from "../spinner-component/index.vue";
import TweetFormInputComponent from "../tweet-form-input-component/index.vue";

const {useUserStore, useTweetStore} = Store;
const userStore = useUserStore();
const tweetStore = useTweetStore();

const { user } = storeToRefs(userStore);
const { submitTweet } = tweetStore;

const userId = ref<string>(user.value?.id as string);
const profileImage = ref<string>(user.value?.profileImage as string);

const loading = ref<boolean>(false);

onBeforeMount(() => {
  EventbusEngine.on(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_STARTED, () => {
    loading.value = true;
  });

  EventbusEngine.on(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_ENDED, () => {
    loading.value = false;
  });
});

onDeactivated(() => {
  EventbusEngine.off(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_STARTED);
  EventbusEngine.off(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_ENDED);
});

</script>



<style scoped>

</style>
