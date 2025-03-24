<template>
  <div class="px-4 py-3 overflow-auto h-full">
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <div
          class="text-xl font-bold"
          :class="
            submitResult.judgeInfo.status === JudgeInfoEnum.SUCCESS.value
              ? 'text-green-500'
              : 'text-red-500'
          "
        >
          {{ JudgeInfoEnumMap.get(submitResult.judgeInfo.status) }}
        </div>
        <div class="text-xs text-gray-400">
          {{ submitResult.judgeInfo.pass }} /
          {{ submitResult.judgeInfo.total }} 个通过的测试用例
        </div>
      </div>
      <div class="text-xs text-gray-500">
        提交于 {{ dayjs(submitResult.createTime).format('YYYY.MM.DD HH:mm') }}
      </div>
    </div>

    <!-- 成功，输出运行时间和内存占用 -->
    <div
      v-if="submitResult.judgeInfo.status === JudgeInfoEnum.SUCCESS.value"
      class="mt-4 flex gap-2"
    >
      <a-tag>
        <template #icon>
          <icon-clock-circle />
        </template>
        {{
          submitResult.judgeInfo.time
            ? `${submitResult.judgeInfo.time} ms`
            : 'N/A'
        }}
      </a-tag>

      <a-tag>
        <template #icon>
          <icon-font type="icon-neicun" />
        </template>
        {{
          submitResult.judgeInfo.memory
            ? `${(submitResult.judgeInfo.memory / 1024 / 1024).toFixed(1)} MB`
            : 'N/A'
        }}
      </a-tag>
    </div>
    <!-- 错误信息，包括编译失败，执行出错 -->
    <div
      class="mt-4"
      v-if="
        [
          JudgeInfoEnum.COMPILE_FAILED.value,
          JudgeInfoEnum.RUN_FAILED.value,
        ].includes(submitResult.judgeInfo.status)
      "
    >
      <div class="bg-red-100 text-red-600 rounded-sm px-3 py-2 mb-4">
        <pre class="whitespace-pre-wrap break-words">{{
          submitResult.judgeInfo.msg
        }}</pre>
      </div>
    </div>
    <!-- 最后执行的输入，包括执行出错、超时和解答错误 -->
    <div
      class="mt-4"
      v-if="
        [
          JudgeInfoEnum.RUN_FAILED.value,
          JudgeInfoEnum.TIMEOUT.value,
          JudgeInfoEnum.WRONG_ANSWER.value,
        ].includes(submitResult.judgeInfo.status)
      "
    >
      <p class="text-gray-400 mb-2">标准输入</p>
      <div
        class="bg-gray-100 rounded-sm px-3 py-2 whitespace-pre-line leading-5"
      >
        {{ submitResult.judgeInfo.input }}
      </div>
    </div>
    <!-- 实际输出与预期输出，包括解答错误 -->
    <div
      class="mt-4"
      v-if="submitResult.judgeInfo.status === JudgeInfoEnum.WRONG_ANSWER.value"
    >
      <p class="text-gray-400 mb-2">实际输出</p>
      <div
        class="bg-gray-100 rounded-sm px-3 py-2 whitespace-pre-line leading-5"
      >
        {{ submitResult.judgeInfo.output }}
      </div>

      <p class="text-gray-400 mt-4 mb-2">期望输出</p>
      <div
        class="bg-gray-100 rounded-sm px-3 py-2 whitespace-pre-line leading-5"
      >
        {{ submitResult.judgeInfo.expectedOutput }}
      </div>
    </div>

    <div class="mt-4 mb-2 flex items-center text-gray-500">
      <span>代码</span>
      <a-divider direction="vertical" />
      <span>{{ submitResult.language }}</span>
    </div>
    <div id="code" />
  </div>
</template>

<script lang="ts" setup>
import { JudgeInfoEnum, JudgeInfoEnumMap } from '@/api/problem/constants'
import type { ProblemSubmitVo } from '@/api/problem/types'
import IconFont from '@/utils/iconfont'
import dayjs from 'dayjs'
import Vditor from 'vditor'
import { inject, onMounted, ref, watch, type Ref } from 'vue'

const submitResult = inject<Ref<ProblemSubmitVo>>(
  'submitResult',
  ref({} as ProblemSubmitVo),
)

watch(
  () => submitResult.value.code,
  () => {
    console.log('刷新了', submitResult.value.code)
    renderVditor()
  },
)

onMounted(() => {
  renderVditor()
})

const renderVditor = () => {
  Vditor.preview(
    document.getElementById('code') as HTMLDivElement,
    `\`\`\`\n${submitResult.value.code}\n\`\`\``,
    {
      mode: 'light',
    },
  )
}
</script>

<style scoped>
:deep(.vditor-reset pre) {
  margin: 0;
}
</style>
