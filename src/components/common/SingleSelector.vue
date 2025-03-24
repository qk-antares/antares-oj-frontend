<template>
  <a-select :model-value="selected" :placeholder="placeholder">
    <a-option
      class="flex items-center"
      v-for="option in options"
      :key="option"
      @click="handleOptionClick(option)"
      :value="option"
      >{{ option }}
      <span class="ml-4 text-base text-blue-500">
        <icon-check v-show="option === selected" />
      </span>
    </a-option>
  </a-select>
</template>

<script setup lang="ts">
const selected = defineModel<string>()
defineProps<{
  placeholder?: string
  options: string[]
}>()

const handleOptionClick = (option: string) => {
  if (option === selected.value) {
    selected.value = undefined
  } else {
    selected.value = option
  }
}
</script>
