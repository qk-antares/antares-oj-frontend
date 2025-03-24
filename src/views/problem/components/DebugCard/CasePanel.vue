<template>
  <div class="p-4 h-full overflow-auto">
    <div class="flex flex-col gap-y-4 min-w-[420px]">
      <!-- Tab 列表 -->
      <div class="flex flex-wrap items-center gap-x-2 gap-y-4">
        <div
          v-for="(tab, index) in inputList"
          :key="index"
          class="relative flex items-center px-4 py-2 rounded-lg cursor-pointer group hover:bg-gray-200"
          :class="{
            'bg-gray-100': activeTab === index,
          }"
          @click="setActiveTab(index)"
        >
          <span>{{ `Case ${index + 1}` }}</span>
          <button
            class="text-xs absolute -top-1 -right-1 w-3 h-3 flex items-center justify-center rounded-full bg-gray-300 text-white hover:bg-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
            @click.stop="removeTab(index)"
          >
            ×
          </button>
        </div>

        <a-button
          size="small"
          type="text"
          @click="addTab"
          class="!text-gray-600"
        >
          <template #icon>
            <icon-plus />
          </template>
        </a-button>
      </div>

      <!-- Tab 内容区域 -->
      <div>
        <p class="text-gray-500 mb-2">标准输入</p>
        <div v-for="(testInput, index) in inputList" :key="testInput.id">
          <a-textarea
            @change="
              (value: string) => {
                testInput.input = value
              }
            "
            class="rounded-md"
            v-show="activeTab === index"
            auto-size
            placeholder="输入用例"
            :default-value="testInput.input"
          ></a-textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import { inject, ref, type Ref } from 'vue'

const activeTab = ref<number>(0)

const inputList = inject<Ref<{ id: string; input: string }[]>>(
  'inputList',
  ref([]),
)

const setActiveTab = (id: number) => {
  activeTab.value = id
}

const addTab = () => {
  inputList.value.push({
    id: uuidv4(),
    input: '',
  })
  setActiveTab(inputList.value.length - 1)
}

const removeTab = (index: number) => {
  inputList.value.splice(index, 1)
  if (activeTab.value === inputList.value.length) {
    setActiveTab(inputList.value.length - 1)
  }
}
</script>
