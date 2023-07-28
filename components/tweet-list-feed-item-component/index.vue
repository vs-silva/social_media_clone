<template>
  <div>

    <tweet-list-feed-item-header-component
        :tweet="props.tweet"
    />

    <div class="ml-16 ">
      <p class="flex-shrink font-medium text-gray-800 w-auto dark:text-white">
        {{props.tweet?.text}}
      </p>

      <div v-if="props.tweet?.mediaId"
           :id="props.tweet?.mediaId"
           class="flex my-3 mr-2 border-2 rounded-2xl"
           :class="Transitions.useTwitterBorderColor()"
      >
        <img :src="props.tweet?.mediaURL"
             alt="tweet_media_image"
             class="w-full rounded-2xl"
        />
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import {Transitions} from "../../composables/transitions";
import TweetListFeedItemHeaderComponent from "../tweet-list-feed-item-header-component/index.vue";

const props = defineProps({
  tweet: {
    type: Object as PropType<ResponseTweetDTO | null>,
    required: false,
    default: null
  }
});

</script>

<style scoped>

</style>
