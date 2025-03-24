<template>
  <div class="overflow-auto px-4 pb-5 select-text" style="height: calc(100vh - 96px)">
    <div id="answer" />
  </div>
</template>

<script setup lang="ts">
import Vditor from 'vditor';
import { onMounted } from 'vue';

const { answer } = defineProps<{
  answer: string
}>()

onMounted(() => {
  Vditor.preview(document.getElementById('answer') as HTMLDivElement, answer, {
    mode: 'light',
  })
})
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
