<template>
  <div>
    <div class="pt-5 space-y-6">

      <auth-form-input-component
        v-model="username"
        :id="`authUserNameFormInput`"
        :type="`text`"
        :label="`Username`"
        :placeholder="`@username`"
      />

      <auth-form-input-component
          v-model="password"
          :id="`authUserPasswordFormInput`"
          :type="`password`"
          :label="`Password`"
          :placeholder="`********`"
      />

      <div>
        <button
            type="button"
            @click.prevent="() => login(<RequestUserAuthDTO>{
              username: username,
              password: password
            })"
        >Login</button>
      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import Store from "../../store";
import AuthFormInputComponent from "../auth-form-input-component/index.vue";
import {RequestUserAuthDTO} from "~/server/business/user/core/dtos/request-user-auth.dto";

const username = ref<string>('');
const password = ref<string>('');

const userStore = Store.useUserStore();
const { login } = userStore;

</script>

<style scoped>

</style>
