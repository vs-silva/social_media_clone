<template>
  <div>
    <main-section-component
        :title="`Home`"
        :loading="loading">

      <Head>
        <Title>Home / Twitter</Title>
      </Head>

      <div class="border-b" :class="Transitions.useTwitterBorderColor()">
        <tweet-form-component />
      </div>


      <tweet-list-feed-component
          :tweets="tweetsCollection"
      />


    </main-section-component>
  </div>
</template>

<script setup lang="ts">
import MainSectionComponent from "../../components/main-section-component/index.vue";
import TweetFormComponent from "../../components/tweet-form-component/index.vue";
import TweetListFeedComponent from "../../components/tweet-list-feed-component/index.vue";
import {Transitions} from "../../composables/transitions";
import Store from "../../store";
import {storeToRefs} from "pinia";
import {onBeforeMount, onDeactivated} from "@vue/runtime-core";
import EventbusEngine from "../../engines/eventbus-engine";
import {TweetServiceEventTypeConstants} from "../../integration/tweet/core/constants/tweet-service-event-type.constants";

const loading = ref<boolean>(false);

const {useTweetStore} = Store;
const tweetStore = useTweetStore();

const { getAllTweets } = tweetStore;
const { tweetsCollection } = storeToRefs(tweetStore);


onBeforeMount(async () => {
  await getAllTweets();

  EventbusEngine.on(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_STARTED, () => {
    loading.value = true;
  });

  EventbusEngine.on(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_ENDED, () => {
    loading.value = false;
  });

  EventbusEngine.on(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_FAILED, () => {
    loading.value = false;
  });
});

onDeactivated(() => {
  EventbusEngine.off(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_STARTED);
  EventbusEngine.off(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_ENDED);
  EventbusEngine.off(TweetServiceEventTypeConstants.TWEET_SERVICE_REQUEST_FAILED);
});

</script>

<style scoped>

</style>
