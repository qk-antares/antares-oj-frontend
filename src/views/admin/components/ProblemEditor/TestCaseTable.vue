<template>
  <div class="w-full">
    <!-- 表格 -->
    <div>
      <!-- 表头 -->
      <div class="grid grid-cols-[1fr_1fr_auto] p-2 bg-gray-100 text-center font-semibold">
        <div class="border-r border-gray-300">输入用例</div>
        <div class="border-r border-gray-300">输出用例</div>
        <div class="w-28">操作</div>
      </div>

      <!-- 添加一行数据按钮 -->
      <div class="w-full p-2 border-b border-gray-300">
        <a-button type="outline" @click="addRow" class="w-full">+ 添加一行数据</a-button>
      </div>

      <!-- 表格内容 -->
      <div v-for="(item, index) in cases" :key="index"
        class="grid grid-cols-[1fr_1fr_auto] border-b border-gray-300 items-center p-2">
        <!-- 输入用例 -->
        <div class="w-full pr-2">
          <a-textarea v-model="item.input" auto-size placeholder="输入用例"></a-textarea>
        </div>

        <!-- 输出用例 -->
        <div class="w-full px-2">
          <a-textarea v-model="item.output" auto-size placeholder="输出用例"></a-textarea>
        </div>

        <!-- 删除按钮 -->
        <div class="flex w-28 justify-center">
          <a-button type="primary" @click="removeRow(index)">
            <template #icon>
              <icon-delete />
            </template>
            删除
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { JudgeCase } from '@/api/problem/types';

const cases = defineModel<JudgeCase[]>('cases', { default: [] })

// 添加一行
const addRow = () => {
  cases.value.unshift({ input: '', output: '' })
};

// 删除一行
const removeRow = (index: number) => {
  cases.value.splice(index, 1) // 删除指定索引的元素
};
</script>
