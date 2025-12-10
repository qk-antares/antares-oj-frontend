<template>
  <div
    class="overflow-auto px-4 pb-5 select-text"
    style="height: calc(100vh - 96px)"
  >
    <div id="answer" />
  </div>
</template>

<script setup lang="ts">
import Vditor from 'vditor'
import { nextTick, watch } from 'vue'

const { answer } = defineProps<{
  answer: string
}>()

watch(
  () => answer,
  newAnswer => {
    console.log('渲染题目答案')

    nextTick(() => {
      const el = document.getElementById('answer') as HTMLDivElement
      if (el) {
        Vditor.preview(el, newAnswer, { mode: 'light' })
      }
    })
  },
  { immediate: true },
)
</script>

<style scoped>
.vditor-reset {
  font-size: 14px;
  overflow: hidden;
}

:deep(.vditor-reset pre > code) {
  font-size: 100%;
}

:deep(.vditor-reset code:not(.hljs):not(.highlight-chroma)) {
  font-size: 100%;
}

:deep(.vditor-reset li + li) {
  margin-top: 0.5em;
}
</style>
