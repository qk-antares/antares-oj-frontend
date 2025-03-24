<script setup lang="ts">
import DividerLine from '@/components/common/DividerLine.vue'
import { computed } from 'vue'
const props = defineProps({
  date: Date
})

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const startDay = computed(() => {
  return props.date?.getDay()
})
const totalDay = computed(() => {
  const year = props.date?.getFullYear() || 0
  const month = (props.date?.getMonth() || 0) + 1
  const nextMonthDate = new Date(year, month, 0)
  return nextMonthDate.getDate()
})
</script>

<template>
  <a-card :content-style="{ padding: '0px' }" class="drop-shadow-sm">
    <div class="flex h-9 items-center pb-[6px] pt-[14px] px-[15px]">
      <div class="min-w-[59px] flex-shrink truncate text-sm font-medium">每日 1 题</div>
      <div class="ml-3 flex items-center">
        <button class="relative">
          <icon-left />
        </button>

        <button class="rounded-lg bg-gray-100 px-[5px] py-0.5">本月</button>

        <button class="relative">
          <icon-right />
        </button>
      </div>
    </div>
    <div class="mx-[10px] grid grid-cols-7 text-xs">
      <span v-for="day in week" :key="day"
        class="text-gray-400 w-8 flex items-center justify-center h-[26px] pointer-events-none">{{ day }}</span>
      <span v-for="i in Array.from({ length: startDay || 0 }, (_, index) => index)" :key="i"></span>
      <a v-for="i in Array.from({ length: totalDay || 0 }, (_, index) => index)" :key="i"
        class="text-slate-600 relative w-8 h-8 flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-200">
        <span>{{ i + 1 }}</span>
        <span class="absolute bottom-[3px] h-1 w-1 rounded-full bg-red-500"></span>
      </a>
    </div>
    <div class="px-[10px] py-2 w-full">
      <divider-line />
    </div>
  </a-card>
</template>
