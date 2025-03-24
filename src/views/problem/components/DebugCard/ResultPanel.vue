<template>
  <div class="p-4 h-full overflow-auto">
    <div class="flex flex-col gap-y-4 min-w-[420px]">
      <template v-if="testResults.code === undefined">
        <a-spin tip="正在运行，请稍等...">
          <template #icon>
            <icon-sync />
          </template>
        </a-spin>
      </template>

      <div
        v-else-if="
          testResults.code === ExecuteCodeStatusEnum.COMPILE_FAILED.value
        "
      >
        <p class="text-red-600 mb-4 text-base">
          {{ ExecuteCodeStatusEnum.COMPILE_FAILED.msg }}
        </p>
        <div
          class="bg-gray-100 text-red-600 rounded-sm px-3 py-2 mb-4 overflow-auto"
        >
          <pre>{{ testResults.msg }}</pre>
        </div>
      </div>

      <div
        v-else-if="testResults.code === ExecuteCodeStatusEnum.RUN_FAILED.value"
      >
        <p class="text-red-600 mb-4 text-base">
          {{ ExecuteCodeStatusEnum.RUN_FAILED.msg }}
        </p>
        <div
          class="bg-gray-100 text-red-600 rounded-sm px-3 py-2 mb-4 overflow-auto"
        >
          <pre>{{ testResults.msg }}</pre>
        </div>
      </div>

      <div v-else-if="testResults.code === ExecuteCodeStatusEnum.TIMEOUT.value">
        <p class="text-red-600 mb-4 text-base">
          {{ ExecuteCodeStatusEnum.TIMEOUT.msg }}
        </p>
      </div>

      <template v-else>
        <!-- Tab 列表 -->
        <div class="flex flex-wrap items-center gap-x-2 gap-y-4">
          <div
            v-for="(tab, index) in testResults.inputList"
            :key="index"
            class="relative flex items-center px-4 py-2 rounded-lg cursor-pointer group hover:bg-gray-200"
            :class="{
              'bg-gray-100': activeTab === index,
            }"
            @click="setActiveTab(index)"
          >
            <span>{{ `Case ${index + 1}` }}</span>
          </div>
        </div>

        <!-- Tab 内容区域 -->
        <div>
          <p class="text-gray-500 mb-4 text-base">
            执行用时：{{ testResults.results[activeTab].time }} ms
          </p>

          <p class="text-gray-500 mb-2">标准输入</p>
          <div
            class="bg-gray-100 rounded-sm px-3 py-2 mb-4 whitespace-pre-line leading-5"
            v-for="(input, index) in testResults.inputList"
            :key="index"
            v-show="activeTab === index"
          >
            {{ input }}
          </div>

          <p class="text-gray-500 mb-2">标准输出</p>
          <div
            class="bg-gray-100 rounded-sm px-3 py-2 whitespace-pre-line leading-5"
            v-for="(result, index) in testResults.results"
            :key="index"
            v-show="activeTab === index"
          >
            {{ result.stderr || result.stdout }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExecuteCodeStatusEnum } from '@/api/problem/constants'
import type { TestResults } from '@/api/problem/types'
import { inject, ref, watch, type Ref } from 'vue'

const activeTab = ref<number>(0)

const testResults = inject<Ref<TestResults>>(
  'testResults',
  ref({} as TestResults),
)

watch(testResults, () => {
  activeTab.value = 0
})

const setActiveTab = (id: number) => {
  activeTab.value = id
}
</script>
