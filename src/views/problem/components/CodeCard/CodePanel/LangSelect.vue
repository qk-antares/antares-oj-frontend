<template>
  <a-popover
    position="bottom"
    trigger="click"
    v-model:popup-visible="popupVisible"
    :arrow-style="{ display: 'none' }"
    :content-style="{ padding: 0 }"
  >
    <span
      class="text-[13px] text-gray-500 py-[1px] hover:bg-gray-100 cursor-pointer px-2 rounded-[5px] transition-all duration-200"
      :style="{ lineHeight: 1.5715, display: 'inline-block' }"
    >
      Java
      <icon-down class="text-sm ml-1" />
    </span>
    <template #content>
      <div class="px-2 pt-1 pb-2 w-[144px] text-[13px]">
        <div
          v-for="lang in LANGUAGES"
          @click="changeLanguage(lang)"
          class="p-[6px] rounded-[4px] cursor-pointer hover:bg-gray-100"
          :key="lang.name"
        >
          <span class="w-5 inline-block">
            <icon-check v-if="lang.enabled" />
          </span>

          {{ lang.name }}

          <span class="float-right mr-1" v-if="!lang.enabled">
            <a-tooltip content="暂不支持">
              <icon-info-circle-fill />
            </a-tooltip>
          </span>
        </div>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import { LANGUAGES } from '@/config/config'
import { Message } from '@arco-design/web-vue'
import { inject, ref, type Ref } from 'vue'

const popupVisible = ref(false)

const language = inject<Ref<string>>('language', ref('Java'))

const changeLanguage = (lang: { name: string; enabled: boolean }) => {
  if (lang.enabled) {
    language.value = lang.name
  } else {
    Message.info({
      content: '不支持的编程语言',
      duration: 3000,
    })
  }
  popupVisible.value = false
}
</script>
