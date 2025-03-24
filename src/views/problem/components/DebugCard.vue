<template>
  <a-card
    :style="{ borderRadius: '6px' }"
    :body-style="{ padding: '0px', height: '100%' }"
    class="w-full h-full"
  >
    <a-tabs
      size="small"
      class="h-full"
      :active-key="debugActive"
      @change="newTab => (debugActive = newTab)"
    >
      <a-tab-pane key="1">
        <template #title>
          <icon-check-square class="text-sm" />
          测试用例
        </template>

        <CasePanel />
      </a-tab-pane>
      <a-tab-pane key="2" :disabled="testResults.code === undefined">
        <template #title>
          <icon-code-square class="text-sm" />
          测试结果
        </template>

        <ResultPanel />
      </a-tab-pane>
    </a-tabs>

    <a-button
      type="text"
      size="small"
      class="!absolute top-1 right-1 !w-6 !h-6"
      @click="$emit('fold')"
    >
      <template #icon>
        <icon-up v-if="fold" />
        <icon-down v-else />
      </template>
    </a-button>
  </a-card>
</template>

<script setup lang="ts">
import type { TestResults } from '@/api/problem/types'
import { inject, ref, type Ref } from 'vue'
import CasePanel from './DebugCard/CasePanel.vue'
import ResultPanel from './DebugCard/ResultPanel.vue'

defineProps<{
  fold?: boolean
}>()

defineEmits<{
  (event: 'fold'): void
}>()

const debugActive = inject<Ref<string | number>>('debugActive', ref('1'))
const testResults = inject<Ref<TestResults>>(
  'testResults',
  ref({} as TestResults),
)
</script>

<style scoped>
:deep(.arco-tabs-nav-tab) {
  padding: 0 4px;
  border-radius: 6px 6px 0 0;
  background: #fafafa;
  user-select: none;
}

:deep(.arco-tabs-content) {
  height: calc(100% - 32px);
  overflow: auto;
}
</style>
