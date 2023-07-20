import {defineStore} from "pinia";
import {UserStore, UserStoreIdentifier} from "./user-store";

export default {
  useUserStore: defineStore(UserStoreIdentifier, UserStore)
};
