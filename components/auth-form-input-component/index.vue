<template>
  <div>

    <label :for="props.id" v-if="props.label"
           class="block pl-3 ml-px text-sm font-medium text-gray-700"
    >{{props.label}}</label>

    <input
       class="block px-4 w-full border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
      :type="props.type"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      :id="props.id"
      @input="(event) => emit(AuthFormInputEventTypeConstants.UPDATED_INPUT_VALUE, (event.target as HTMLInputElement).value)"
    />

  </div>
</template>

<script setup lang="ts">
import {AuthFormInputEventTypeConstants} from "./constants/auth-form-input-event-type.constants";

const emit = defineEmits([
  AuthFormInputEventTypeConstants.UPDATED_INPUT_VALUE
]);

const props = defineProps({
  id: {
    type: String,
    required: false,
    default: ''
  },
  type: {
    type: String,
    required: false,
    default: 'text'
  },
  modelValue: {
    type: String,
    required: true,
    default: ''
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  placeholder: {
    type: String,
    required: false,
    default: ''
  },
});

</script>


<style scoped>

</style>
