<template>
  <div>
    <div v-if="props.tweets?.length"
         class="pb-4 border-b hover:bg-gray-100 cursor-pointer dark:hover:bg-dim-300"
         :class="[Transitions.useTwitterBorderColor(), Transitions.useDefaultTransition()]"
         v-for="tweet in props.tweets"
         :key="tweet.id">
            <tweet-list-feed-item-component
                :id="tweet.id"
                :tweet="tweet"
            />
    </div>

    <div v-else class="p-4">
      <p class="text-center text-gray-500">
        {{translate('tweet.message.no_tweets')}}
      </p>
    </div>

  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import TweetListFeedItemComponent from "../tweet-list-feed-item-component/index.vue";
import {Transitions} from "../../composables/transitions";
import {translate} from "../../client/engines/language-resource-engine";

const props = defineProps({
  tweets: {
    type: Array as PropType<ResponseTweetDTO[] | null>,
    required: false,
    default: null
  }
});



</script>

<style scoped>

</style>
