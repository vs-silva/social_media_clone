<template>
  <div class="flex p-4">

    <div>
      <img
          :src="author?.profileImage"
          alt="tweet_author_profile_image"
          class="rounded-full w-10 h-10"
      />
    </div>

    <div class="ml-3">
      <span class="font-medium text-gray-800 dark:text-white">{{author?.name}}</span>

      <span class="ml-3 text-sm font-medium text-gray-400" v-if="props.tweet">
        <nuxt-link :to="tweetPageURL">
          <span class="hover:text-blue-400">{{`@${author?.username}`}}</span>
        </nuxt-link>
        {{`. ${humanizeDate(((props.tweet?.updatedAt as unknown) as string).toString())} ${translate('tweet.moment.past')}`}}
      </span>

      <p v-if="props.tweet?.replyToId" class="text-sm">
        <span class="text-gray-500">
          {{translate('tweet.message.reply')}}
        </span>
        <nuxt-link :to="replyToTweetURL" class="text-blue-400">
          {{translate('todo.reply.tweet.mechanism')}}
        </nuxt-link>
      </p>

    </div>

  </div>
</template>

<script setup lang="ts">
import {PropType, computed} from "@vue/runtime-core";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import {translate} from "../../engines/language-resource-engine";
import {humanizeDate} from "../../engines/time-engine";

const props = defineProps({
  tweet: {
    type: Object as PropType<ResponseTweetDTO | null>,
    required: false,
    default: null
  }
});

const author = props.tweet?.author;
const tweetPageURL = computed(() => `TODO${props.tweet?.id}`);
const replyToTweetURL = computed(() => `TODO${props.tweet?.replyToId}`);

</script>

<style scoped>

</style>
