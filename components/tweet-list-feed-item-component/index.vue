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

      <div class="mt-2">
        <tweet-list-feed-item-actions-component>

          <tweet-list-feed-item-actions-icon-component
            :iconType="`${TweetListFeedItemActionsIconConstants.CHAT_ICON}`"
            :iconColor="`${TweetListFeedItemActionsIconColorConstants.BLUE}`"
            :icon-total-items="10"
            @click.prevent="() => {EventbusEngine.emit(TweetStoreEventTypeConstants.TOGGLE_TWEET_REPLY_MODAL, tweet);}"
          />

          <tweet-list-feed-item-actions-icon-component
              :iconType="`${TweetListFeedItemActionsIconConstants.REFRESH_ICON}`"
              :iconColor="`${TweetListFeedItemActionsIconColorConstants.GREEN}`"
              :icon-total-items="Generators.useGenerateRandomNumber()"
          />

          <tweet-list-feed-item-actions-icon-component
              :iconType="`${TweetListFeedItemActionsIconConstants.HEART_ICON}`"
              :iconColor="`${TweetListFeedItemActionsIconColorConstants.RED}`"
              :icon-total-items="Generators.useGenerateRandomNumber()"
          />

          <tweet-list-feed-item-actions-icon-component
              :iconType="`${TweetListFeedItemActionsIconConstants.UPLOAD_ICON}`"
              :iconColor="`${TweetListFeedItemActionsIconColorConstants.BLUE}`"
              :icon-total-items="Generators.useGenerateRandomNumber()"
          />

        </tweet-list-feed-item-actions-component>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {PropType} from "@vue/runtime-core";
import EventbusEngine from "../../engines/eventbus-engine";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import {Transitions} from "../../composables/transitions";
import {Generators} from "../../composables/generators";
import TweetListFeedItemHeaderComponent from "../tweet-list-feed-item-header-component/index.vue";
import TweetListFeedItemActionsComponent from "../tweet-list-feed-item-actions-component/index.vue";
import TweetListFeedItemActionsIconComponent from "../tweet-list-feed-item-actions-icon-component/index.vue";
import {TweetListFeedItemActionsIconConstants} from "../tweet-list-feed-item-actions-icon-component/constants/tweet-list-feed-item-actions-icon.constants";
import {TweetListFeedItemActionsIconColorConstants} from "../tweet-list-feed-item-actions-icon-component/constants/tweet-list-feed-item-actions-icon-color.constants";
import {TweetStoreEventTypeConstants} from "../../store/tweet-store/constants/tweet-store-event-type.constants";

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
