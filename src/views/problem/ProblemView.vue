<template>
  <!-- 50px是Header的高度+底部padding -->
  <div
    :style="{ height: 'calc(100vh - 50px)' }"
    class="bg-gray-100 pb-2 px-2 min-w-[820px]"
  >
    <a-split
      class="h-full w-full"
      direction="horizontal"
      min="0.3"
      max="0.7"
      default-size="0.5"
    >
      <!-- 题目描述 -->
      <template #first>
        <div class="w-full h-full pr-1">
          <problem-info-card v-if="problem" :problem="problem" />
        </div>
      </template>

      <template #second>
        <!-- 102px是Header的高度+底部padding+DebugCard的最小高度 -->
        <a-split
          direction="vertical"
          class="h-full pl-1"
          :min="0.15"
          :max="pageHeight - 102"
          :default-size="pageHeight - 102"
          v-model:size="height"
        >
          <!-- 代码区 -->
          <template #first>
            <div class="w-full h-full pb-1">
              <code-card />
            </div>
          </template>
          <!-- 调试区 -->
          <template #second>
            <div class="w-full h-full pt-1 overflow-hidden">
              <debug-card :fold="fold" @fold="changeFold" />
            </div>
          </template>
        </a-split>
      </template>
    </a-split>
  </div>
</template>

<script lang="ts" setup>
import { getSafeProblemVoById } from '@/api/problem'
import type { SafeProblemVo } from '@/api/problem/types'
import { useWindowSize } from '@/composables/useWindowSize'
import { v4 as uuidv4 } from 'uuid'
import { computed, inject, onMounted, ref, watch, type Ref } from 'vue'
import CodeCard from './components/CodeCard.vue'
import DebugCard from './components/DebugCard.vue'
import ProblemInfoCard from './components/InfoCard.vue'

const { problemId } = defineProps<{
  problemId: number
}>()

const inputList = inject<Ref<{ id: string; input: string }[]>>(
  'inputList',
  ref([]),
)

const { pageHeight } = useWindowSize()

const height = inject('height', ref())

const problem = ref<SafeProblemVo>()

const fold = computed(() => {
  if (height.value && pageHeight.value) {
    return parseInt(height.value) >= pageHeight.value - 102
  } else {
    return true
  }
})

// 在组件挂载后添加事件监听
onMounted(() => {
  getSafeProblemVoById(problemId).then(res => {
    problem.value = res.data.data
    inputList.value = res.data.data.judgeCase.map(item => ({
      id: uuidv4(),
      input: item,
    }))
  })
})

// 监听页面尺寸变化
watch(pageHeight, newHeight => {
  height.value = `${Math.min(newHeight - 102, parseInt(height.value))}px`
})

const changeFold = () => {
  if (fold.value) {
    height.value = `${(pageHeight.value - 54) * 0.5}px`
  } else {
    height.value = `${pageHeight.value - 102}px`
  }
}
</script>

<style scoped>
:deep(.arco-tabs-nav-size-small.arco-tabs-nav-type-line .arco-tabs-tab) {
  font-size: 0.875rem;
  padding: 4px 0;
}

:deep(.arco-tabs-nav-type-line .arco-tabs-tab) {
  margin: 0 8px;
}

:deep(.arco-tabs-content) {
  padding-top: 0;
}

:deep(.arco-btn-size-mini) {
  padding: 0 6px;
}

:deep(.vditor-reset pre > code) {
  background: rgba(27, 31, 35, 0.05);
  max-height: none !important;
}
</style>
