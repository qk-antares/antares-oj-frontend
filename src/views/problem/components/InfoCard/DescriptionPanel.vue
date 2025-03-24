<template>
  <div
    class="overflow-auto px-4 py-5 select-text"
    style="height: calc(100vh - 96px)"
  >
    <a-space direction="vertical" size="medium">
      <div class="text-2xl font-bold">
        {{ problem.id }}. {{ problem.title }}
      </div>

      <a-space :size="[40, 8]">
        <div
          class="text-base"
          :class="{
            'text-easy': problem.difficulty === '简单',
            'text-medium': problem.difficulty === '中等',
            'text-hard': problem.difficulty === '困难',
          }"
        >
          {{ problem.difficulty }}
        </div>

        <a-space>
          <a-tag v-for="tag in problem.tags" :key="tag">{{ tag }}</a-tag>
        </a-space>

        <div
          v-if="['已通过', '尝试过'].includes(problem.status)"
          class="flex items-center text-base"
        >
          <span class="mr-1 text-gray-500">{{ problem.status }}</span>
          <SolvedIcon
            v-if="problem.status === ProblemStatusEnum.SOLVED"
            class="text-solved mt-[2px]"
          />
          <TriedIcon v-else class="text-medium mt-[2px]" />
        </div>
      </a-space>
    </a-space>

    <a-divider />

    <div id="content" />

    <a-space class="mt-8" size="large">
      <div class="flex items-baseline">
        <span class="text-gray-400">通过次数：</span>
        <span class="font-bold text-gray-800 text-base">{{
          problem.acceptedNum
        }}</span>
      </div>
      <div class="flex items-baseline">
        <span class="text-gray-400">提交次数：</span>
        <span class="font-bold text-gray-800 text-base">{{
          problem.submitNum
        }}</span>
      </div>
      <div class="flex items-baseline">
        <span class="text-gray-400">通过率：</span>
        <span class="font-bold text-gray-800 text-base"
          >{{
            ((problem.acceptedNum / (problem.submitNum | 1)) * 100).toFixed(1)
          }}
          %</span
        >
      </div>
    </a-space>

    <div class="text-gray-500 text-xs mt-12">
      © 2025 流火 Judge 在线判题平台
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProblemStatusEnum } from '@/api/problem/constants'
import type { SafeProblemVo } from '@/api/problem/types'
import SolvedIcon from '@/components/icons/SolvedIcon.vue'
import TriedIcon from '@/components/icons/TriedIcon.vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { onMounted } from 'vue'

const { problem } = defineProps<{
  problem: SafeProblemVo
}>()

onMounted(() => {
  Vditor.preview(
    document.getElementById('content') as HTMLDivElement,
    problem.content,
    {
      mode: 'light',
    },
  )
})
</script>

<style scoped>
.vditor-reset {
  font-size: 14px;
  overflow: hidden;
  cursor: text;
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
