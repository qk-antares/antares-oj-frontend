<template>
  <nav class="flex h-[50px] w-full min-w-[820px] justify-center bg-gray-100">
    <div class="mx-auto flex h-full w-full items-center px-6">
      <router-link to="/">
        <div class="flex items-center">
          <span class="h-[22px]">
            <img class="h-[22px] object-cover" src="/favicon.svg" alt="logo" />
          </span>

          <a-divider direction="vertical" />
        </div>
      </router-link>

      <ProblemRouter />

      <div
        v-if="!loading"
        class="flex-grow flex justify-center pr-[161px] space-x-[1px]"
      >
        <a-button
          @click="handleRun"
          class="common-button"
          :style="{ color: 'black' }"
          type="text"
        >
          <template #icon>
            <icon-font type="icon-yunhang" class="text-lg" />
          </template>
          运行
        </a-button>
        <a-button
          @click="handleSubmit"
          class="common-button"
          :style="{ color: '#01b328' }"
          type="text"
        >
          <template #icon>
            <icon-font type="icon-cloudupload" class="text-lg" />
          </template>
          提交
        </a-button>
      </div>
      <div
        v-if="loading"
        class="flex-grow flex justify-center pr-[161px] text-gr"
      >
        <a-button
          class="common-button"
          :style="{ background: '#E7E7E7' }"
          type="text"
          :disabled="true"
        >
          <template #icon>
            <icon-loading class="text-lg" />
          </template>
          执行判题中...
        </a-button>
      </div>

      <a-space direction="horizontal" class="ml-auto">
        <user-avatar />
      </a-space>
    </div>
  </nav>
  <slot />
</template>

<script lang="ts" setup>
import type { Page } from '@/api/common/types'
import { doProblemRun, doProblemSubmit } from '@/api/problem'
import type { ProblemSubmitVo, TestResults } from '@/api/problem/types'
import UserAvatar from '@/components/header/UserAvatar.vue'
import { useWindowSize } from '@/composables/useWindowSize'
import { CODE_TEMPLATE } from '@/config/config'
import IconFont from '@/utils/iconfont'
import { Message } from '@arco-design/web-vue'
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import ProblemRouter from './components/ProblemRouter.vue'

// 与题目相关的状态
const language = ref('Java')
const code = ref(CODE_TEMPLATE)
const inputList = ref<{ id: string; input: string }[]>([])
const testResults = ref<TestResults>({} as TestResults)
const submitResult = ref<ProblemSubmitVo>({} as ProblemSubmitVo)
const submitLogs = ref<Page<ProblemSubmitVo>>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
})

provide('language', language)
provide('code', code)
provide('inputList', inputList)
provide('testResults', testResults)
provide('submitResult', submitResult)
provide('submitLogs', submitLogs)

// 与标签页相关的状态
const infoActive = ref('1')
const codeActive = ref('1')
const debugActive = ref('1')
provide('infoActive', infoActive)
provide('codeActive', codeActive)
provide('debugActive', debugActive)

// 与折叠面板相关
const { pageHeight } = useWindowSize()
const height = ref()
provide('height', height)

// 布局页面自己的状态
const route = useRoute()
const problemId = computed(() => Number(route.params.problemId))
const loading = ref(false)

const handleRun = () => {
  // 未输入测试用例
  if (inputList.value.length === 0) {
    Message.error({
      content: '请输入测试用例',
      duration: 5 * 1000,
    })
    return
  }

  loading.value = true

  // 清空测试结果
  testResults.value = {} as TestResults

  doProblemRun({
    code: code.value,
    language: language.value,
    inputList: inputList.value.map(item => item.input),
  }).then(res => {
    testResults.value = {
      inputList: inputList.value.map(item => item.input),
      ...res.data.data,
    }

    loading.value = false
  })
  // 改变debug标签页与页高
  debugActive.value = '2'
  height.value = `${(pageHeight.value - 54) * 0.5}px`
}

const handleSubmit = () => {
  loading.value = true
  doProblemSubmit({
    code: code.value,
    language: language.value,
    problemId: problemId.value,
  }).then(res => {
    submitResult.value = res.data.data
    codeActive.value = '2'
    submitLogs.value.records.unshift(res.data.data)

    loading.value = false
  })
}
</script>

<style scoped>
.common-button {
  background-color: #e7e7e7;
  padding: 0 12px;
  line-height: 1;
}

.common-button:hover {
  background-color: #e2e2e2;
}
</style>
