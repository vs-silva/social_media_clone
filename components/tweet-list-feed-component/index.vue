<template>
  <div>
    <div v-if="props.tweets">
      <tweet-list-feed-item-component
          v-for="tweet in props.tweets"
          :key="tweet.id"
          :id="tweet.id"
          :tweet="tweet"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import TweetListFeedItemComponent from "../tweet-list-feed-item-component/index.vue";

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
