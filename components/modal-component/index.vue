<template>
  <div :class="modalCloser" class="absolute inset-0 bg-black bg-opacity-50 z-10 scrollbar-hide h-full overflow-hidden" v-if="showModal" @click.stop.prevent="(event: MouseEvent) => {
     (event.target as HTMLElement).classList.forEach( classItem => {
       if(classItem === modalCloser) {
         closeModal()
         return;
       }
     });
  }">

    <div :class="modalCloser" class="flex items-start justify-center min-h-screen mt-24 text-center" >

      <div class="bg-white text-black rounded-lg text-center shadow-xl p-6 w-sm" role="dialog" aria-modal="true">

        <div class="flex text-gray-400 group">
          <div :class="`p-2 rounded-full
        group-hover:bg-${closeButtonColor}-100
        group-hover:text-${closeButtonColor}-400
        group-hover:text-${closeButtonColor}-100
        dark:group-hover:bg-opacity-20 ${Transitions.useDefaultTransition()}`">

            <XMarkIcon class="w-5 h-5 cursor-pointer" @click.stop.prevent="(event: MouseEvent) => {closeModal()}" />

          </div>
        </div>

        <div>
          {{tweetToReply}}
        </div>

        <div class="flex justify-center py-4 text-white">

          <button-component>Reply</button-component>

        </div>

        <tweet-form-component
            :formTextPlaceHolder="translate('tweet.form.placeholderTextPostYourReply')"
        />



      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import {ref, onBeforeMount, onDeactivated} from "@vue/runtime-core";
import ButtonComponent from "../button-component/index.vue";
import EventbusEngine from "../../engines/eventbus-engine";
import {TweetStoreEventTypeConstants} from "../../store/tweet-store/constants/tweet-store-event-type.constants";
import type {ResponseTweetDTO} from "../../server/business/tweet/core/dtos/response-tweet-dto";
import {Toggles} from "../../composables/toggles";
import TweetFormComponent from "../tweet-form-component/index.vue";
import {translate} from "../../engines/language-resource-engine";
import {Transitions} from "../../composables/transitions";
import { XMarkIcon, XCircleIcon } from "@heroicons/vue/24/outline";


const showModal = ref<boolean>(false);
const tweetToReply = ref<ResponseTweetDTO | null>(null);
const modalCloser = ref('modalCloser');

const closeButtonColor = ref<string>('red');

function closeModal():void {
  showModal.value = false;
  tweetToReply.value = null;
}

onBeforeMount(() => {
  EventbusEngine.on(TweetStoreEventTypeConstants.TOGGLE_TWEET_REPLY_MODAL, (tweet) => {
    tweetToReply.value = tweet as ResponseTweetDTO | null;
    Toggles.useBooleanToggle(showModal);
  });
});

onDeactivated(() => {
  EventbusEngine.off(TweetStoreEventTypeConstants.TOGGLE_TWEET_REPLY_MODAL);
});

</script>

<style scoped>
.overflow-hidden::-webkit-scrollbar {
  display: none;
}
</style>
