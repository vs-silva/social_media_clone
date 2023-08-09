<template>
  <div class="flex text-gray-400 cursor-pointer group">

    <div :class="`p-2 rounded-full
        group-hover:bg-${props.iconColor}-100
        group-hover:text-${props.iconColor}-400
        group-hover:text-${props.iconColor}-100
        dark:group-hover:bg-opacity-20 ${Transitions.useDefaultTransition()}`"
    >
      <ChatBubbleOvalLeftEllipsisIcon class="w-5 h-5" v-if="props.iconType === TweetListFeedItemActionsIconConstants.CHAT_ICON"/>
      <HeartIcon class="w-5 h-5" v-if="props.iconType === TweetListFeedItemActionsIconConstants.HEART_ICON"/>
      <ArrowPathIcon class="w-5 h-5" v-if="props.iconType === TweetListFeedItemActionsIconConstants.REFRESH_ICON"/>
      <ArrowUpTrayIcon class="w-5 h-5" v-if="props.iconType === TweetListFeedItemActionsIconConstants.UPLOAD_ICON"/>
    </div>

    <div class="pt-1.5 pl-.5">
      <span class="ml-1" :class="`group-hover:text-${props.iconColor}-400`">
        {{props.iconTotalItems}}
      </span>
    </div>


  </div>
</template>

<script setup lang="ts">
import { TweetListFeedItemActionsIconConstants } from "./constants/tweet-list-feed-item-actions-icon.constants";
import {TweetListFeedItemActionsIconColorConstants} from "./constants/tweet-list-feed-item-actions-icon-color.constants";
import { Transitions } from "../../composables/transitions";
import { ChatBubbleOvalLeftEllipsisIcon, HeartIcon, ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  iconType: {
    type: String,
    required: false,
    default: TweetListFeedItemActionsIconConstants.CHAT_ICON
  },
  iconColor: {
    type: String,
    required: false,
    default: TweetListFeedItemActionsIconColorConstants.BLUE
  },
  iconTotalItems: {
    type: Number,
    required: false,
    default: 0
  }
});

</script>

<style scoped>

</style>
