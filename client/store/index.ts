import {defineStore} from "pinia";
import {UserStore, UserStoreIdentifier} from "./user-store";
import {TweetStore, TweetStoreIdentifier} from "./tweet-store";
import {TrendingStore, TrendingStoreIdentifier} from "./trending-store";
import {PeopleStore, PeopleStoreIdentifier} from "./people-store";

export default {
  useUserStore: defineStore(UserStoreIdentifier, UserStore),
  useTweetStore: defineStore(TweetStoreIdentifier, TweetStore),
  useTrendingStore: defineStore(TrendingStoreIdentifier, TrendingStore),
  usePeopleStore: defineStore(PeopleStoreIdentifier, PeopleStore)
};
