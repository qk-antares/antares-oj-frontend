<template>
  <a-card
    :style="{ borderRadius: '6px' }"
    :body-style="{ padding: '0px', height: '100%' }"
    class="w-full h-full"
  >
    <a-tabs
      size="small"
      :active-key="codeActive"
      @change="newTab => (codeActive = newTab)"
    >
      <a-tab-pane key="1">
        <template #title>
          <icon-code class="text-sm" />
          代码
        </template>

        <CodePanel />
      </a-tab-pane>
      <a-tab-pane v-if="submitResult.status !== undefined" key="2">
        <template #title>
          <icon-history class="text-sm" />
          提交记录
          <icon-close
            class="hover:bg-gray-200 rounded-sm"
            @click="closeHistoryPanel"
          />
        </template>
        <HistoryPanel />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import type { ProblemSubmitVo } from '@/api/problem/types'
import { inject, ref, type Ref } from 'vue'
import CodePanel from './CodeCard/CodePanel.vue'
import HistoryPanel from './CodeCard/HistoryPanel.vue'

const submitResult = inject<Ref<ProblemSubmitVo>>(
  'submitResult',
  ref({} as ProblemSubmitVo),
)
const codeActive = inject<Ref<string | number>>('codeActive', ref('1'))

const closeHistoryPanel = () => {
  submitResult.value = {} as ProblemSubmitVo
  codeActive.value = '1'
}
</script>

<style scoped>
:deep(.arco-tabs) {
  height: 100%;
}

:deep(.arco-tabs-nav-tab) {
  padding: 0 4px;
  border-radius: 6px 6px 0 0;
  background: #fafafa;
  user-select: none;
}

:deep(.arco-tabs-content) {
  height: calc(100% - 32px);
}

:deep(.arco-tabs-content-list) {
  height: 100%;
}

:deep(.arco-tabs-content-item) {
  height: 100%;
}

:deep(.arco-tabs-pane) {
  height: 100%;
}
</style>
