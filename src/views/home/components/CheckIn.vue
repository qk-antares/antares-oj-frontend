<script setup lang="ts">
import { getCheckInDates } from '@/api/problem'
import SolvedIcon from '@/components/icons/SolvedIcon.vue'
import { computed, ref, watch } from 'vue'

const props = defineProps({
  month: {
    type: String,
    default: '',
  },
})

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const today = new Date()
const todayDateStr = formatDate(today)
const defaultMonth = formatMonth(today)
const MIN_MONTH = '2024-01'
const MAX_MONTH = formatMonth(today)

const currentMonth = ref(clampMonth(props.month || defaultMonth))

watch(
  () => props.month,
  value => {
    if (value) {
      currentMonth.value = clampMonth(value)
    }
  },
)

const signedDates = ref<Set<string>>(new Set())

watch(
  currentMonth,
  month => {
    getCheckInDates(month).then(res => {
      signedDates.value = new Set(res.data.data)
    })
  },
  { immediate: true },
)

const monthInfo = computed(() => parseMonth(currentMonth.value))
const startWeekday = computed(() =>
  new Date(monthInfo.value.year, monthInfo.value.month - 1, 1).getDay(),
)
const daysInMonth = computed(() =>
  new Date(monthInfo.value.year, monthInfo.value.month, 0).getDate(),
)

const leadingPlaceholders = computed(() =>
  Array.from({ length: startWeekday.value }, (_, index) => index),
)

const calendarDays = computed(() => {
  const days = [] as Array<{
    day: number
    dateStr: string
    checked: boolean
    showMissed: boolean
    isFuture: boolean
    isToday: boolean
  }>

  for (let day = 1; day <= daysInMonth.value; day++) {
    const date = new Date(monthInfo.value.year, monthInfo.value.month - 1, day)
    const dateStr = formatDate(date)
    const isFuture = dateStr > todayDateStr
    const isToday = dateStr === todayDateStr
    const checked = signedDates.value.has(dateStr)
    const showMissed = !checked && !isFuture && dateStr <= todayDateStr
    days.push({ day, dateStr, checked, showMissed, isFuture, isToday })
  }

  return days
})

const monthLabel = computed(
  () =>
    `${monthInfo.value.year}年${String(monthInfo.value.month).padStart(2, '0')}月`,
)

const canGoPrev = computed(
  () => compareMonth(currentMonth.value, MIN_MONTH) > 0,
)
const canGoNext = computed(
  () => compareMonth(currentMonth.value, MAX_MONTH) < 0,
)

function goPrevMonth() {
  if (!canGoPrev.value) return
  stepMonth(-1)
}

function goNextMonth() {
  if (!canGoNext.value) return
  stepMonth(1)
}

function stepMonth(offset: number) {
  const baseDate = new Date(
    monthInfo.value.year,
    monthInfo.value.month - 1 + offset,
    1,
  )
  const candidate = formatMonth(baseDate)
  if (
    compareMonth(candidate, MIN_MONTH) < 0 ||
    compareMonth(candidate, MAX_MONTH) > 0
  ) {
    return
  }
  currentMonth.value = candidate
}

function parseMonth(value: string) {
  const [yearStr, monthStr] = value.split('-')
  return {
    year: Number(yearStr),
    month: Number(monthStr),
  }
}

function formatMonth(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function compareMonth(a: string, b: string) {
  const [aYear, aMonth] = a.split('-').map(Number)
  const [bYear, bMonth] = b.split('-').map(Number)
  return aYear * 12 + (aMonth - 1) - (bYear * 12 + (bMonth - 1))
}

function clampMonth(value: string) {
  const normalized = /^\d{4}-\d{2}$/.test(value) ? value : defaultMonth
  if (compareMonth(normalized, MIN_MONTH) < 0) return MIN_MONTH
  if (compareMonth(normalized, MAX_MONTH) > 0) return MAX_MONTH
  return normalized
}
</script>

<template>
  <div class="flex h-9 items-center px-[13px]">
    <div class="min-w-[59px] flex-shrink truncate text-sm font-medium">
      每日打卡
    </div>
    <div class="ml-3 flex items-center">
      <button @click="goPrevMonth" class="relative text-slate-700 disabled:text-gray-300" :disabled="!canGoPrev">
        <icon-left />
      </button>

      <span class="rounded-lg bg-gray-100 px-[5px] py-0.5 text-sm font-medium">{{ monthLabel }}</span>

      <button @click="goNextMonth" class="relative text-slate-700 disabled:text-gray-300" :disabled="!canGoNext">
        <icon-right />
      </button>
    </div>
  </div>

  <div class="mx-2 grid grid-cols-7 text-xs">
    <span v-for="day in week" :key="day"
      class="text-gray-400 w-8 flex items-center justify-center h-[26px] pointer-events-none">{{ day }}</span>
    <span v-for="placeholder in leadingPlaceholders" :key="`placeholder-${placeholder}`"></span>
    <a v-for="day in calendarDays" :key="day.dateStr"
      class="text-slate-600 relative w-8 h-8 flex cursor-pointer items-center justify-center rounded-full hover:bg-gray-200">
      <span v-if="!day.checked">{{ day.day }}</span>
      <SolvedIcon v-if="day.checked" class="absolute bottom-[5px] text-emerald-500" />
      <span v-else-if="day.showMissed" class="absolute bottom-[3px] h-1 w-1 rounded-full bg-red-500"></span>
    </a>
  </div>
</template>
