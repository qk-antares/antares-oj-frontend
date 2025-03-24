<script setup lang="ts">
import { ref, watch } from 'vue'

const searchState = ref<boolean>(false)
const keyword = ref<string>('')
const input = ref<any>(null)

watch(searchState, (newSearchState) => {
  if (newSearchState) {
    input.value.focus()
  }
})
</script>

<template>
  <div class="relative flex items-center">
    <div
      class="rounded-full z-2 h-8 bg-gray-100 absolute overflow-hidden flex items-center right-0 transition-[width] duration-200"
      :style="{ width: searchState ? '240px' : '0px' }"
    >
      <span class="pl-3 flex items-center text-gray-500">
        <icon-search size="20" />
      </span>

      <input
        ref="input"
        class="text-sm ml-1 mr-9 bg-transparent outline-none my-[6px] w-full"
        @blur="
          () => {
            searchState = !searchState
          }
        "
        placeholder="搜索"
        v-model="keyword"
      />
    </div>

    <a-button
      type="text"
      :style="{ display: searchState ? 'none' : 'flex' }"
      @click="
        () => {
          searchState = true
        }
      "
    >
      <template #icon>
        <span class="flex items-center text-gray-500">
          <icon-search size="20" />
        </span>
      </template>
    </a-button>
  </div>
</template>
