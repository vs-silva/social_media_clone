import {defineStore} from "pinia";
import {UserStore, UserStoreIdentifier} from "./user-store";
import {TweetStore, TweetStoreIdentifier} from "./tweet-store";

export default {
  useUserStore: defineStore(UserStoreIdentifier, UserStore),
  useTweetStore: defineStore(TweetStoreIdentifier, TweetStore),
};
