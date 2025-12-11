<script setup lang="ts">
import type { SubmitSummaryVo } from '@/api/problem/types'
import { computed, ref } from 'vue'

const props = defineProps<{
  summary: SubmitSummaryVo
  size?: number
  viewBox?: number
  strokeWidth?: number
  padding?: number
}>()

type DifficultyKey = 'easy' | 'medium' | 'hard'

// 和环形统计图相关的类型
interface BaseSegment {
  color: string
  startFraction: number
  fraction: number
  dasharray: string
  dashoffset: number
  total: number
}

interface SolvedSegment extends BaseSegment {
  type: 'solved'
  key: DifficultyKey
  solved: number
}

interface UnsolvedSegment extends BaseSegment {
  type: 'unsolved'
  key: 'unsolved'
  solved: number
}

type Segment = SolvedSegment | UnsolvedSegment

type CenterState =
  | { mode: 'fraction'; numerator: number; denominator: number }
  | { mode: 'rate'; rate: string }

// 一些颜色信息
const difficultyMeta: Record<DifficultyKey, { label: string; color: string }> =
  {
    easy: { label: '简单', color: '#22c55e' },
    medium: { label: '中等', color: '#f59e0b' },
    hard: { label: '困难', color: '#ef4444' },
  }

const GREY_COLOR = '#d1d5db'

const formatPercent = (value: number) => {
  const percent = value * 100
  if (!Number.isFinite(percent)) {
    return '0%'
  }
  if (percent === 0 || percent === 100) {
    return `${percent.toFixed(0)}%`
  }
  return `${percent.toFixed(2)}%`
}

const withAlpha = (hexColor: string, alpha: number) => {
  const hex = hexColor.replace('#', '')
  const normalized =
    hex.length === 3
      ? hex
          .split('')
          .map(char => char + char)
          .join('')
      : hex
  const value = parseInt(normalized, 16)
  const r = (value >> 16) & 0xff
  const g = (value >> 8) & 0xff
  const b = value & 0xff
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const isHovering = ref(false)

const chartSize = computed(() => Math.max(props.size ?? 98, 80))
const viewBoxSize = computed(() => Math.max(props.viewBox ?? 200, 100))
const strokeWidth = computed(() => Math.max(props.strokeWidth ?? 18, 4))
const padding = computed(() => Math.max(props.padding ?? 0, 0))
const center = computed(() => viewBoxSize.value / 2)
const radius = computed(() =>
  Math.max(center.value - padding.value - strokeWidth.value / 2, 0),
)
const circumference = computed(() => 2 * Math.PI * radius.value)

const difficultyDetails = computed(() => {
  const summary = props.summary

  return [
    {
      key: 'easy' as const,
      label: difficultyMeta.easy.label,
      color: difficultyMeta.easy.color,
      background: withAlpha(difficultyMeta.easy.color, 0.12),
      solved: summary.easyPass,
      total: summary.easyTotal,
    },
    {
      key: 'medium' as const,
      label: difficultyMeta.medium.label,
      color: difficultyMeta.medium.color,
      background: withAlpha(difficultyMeta.medium.color, 0.12),
      solved: summary.mediumPass,
      total: summary.mediumTotal,
    },
    {
      key: 'hard' as const,
      label: difficultyMeta.hard.label,
      color: difficultyMeta.hard.color,
      background: withAlpha(difficultyMeta.hard.color, 0.12),
      solved: summary.hardPass,
      total: summary.hardTotal,
    },
  ]
})

const totalSolved = computed(() =>
  difficultyDetails.value.reduce((acc, item) => acc + item.solved, 0),
)

const totalProblems = computed(() =>
  difficultyDetails.value.reduce((acc, item) => acc + item.total, 0),
)

const segments = computed<Segment[]>(() => {
  const total = totalProblems.value
  const circleLength = circumference.value
  if (total <= 0 || circleLength <= 0) {
    return []
  }
  let offsetFraction = 0
  const result: Segment[] = []

  difficultyDetails.value.forEach(detail => {
    if (detail.total <= 0 || detail.solved <= 0) {
      return
    }
    const solvedFraction = detail.solved / total
    if (solvedFraction <= 0) {
      return
    }
    const length = solvedFraction * circleLength
    result.push({
      key: detail.key,
      type: 'solved',
      color: detail.color,
      startFraction: offsetFraction,
      fraction: solvedFraction,
      dasharray: `${length} ${Math.max(circleLength - length, 0)}`,
      dashoffset: circleLength * (1 - offsetFraction),
      solved: detail.solved,
      total: detail.total,
    })
    offsetFraction += solvedFraction
  })

  const unsolvedCount = Math.max(total - totalSolved.value, 0)
  if (unsolvedCount > 0) {
    const unsolvedFraction = unsolvedCount / total
    const length = unsolvedFraction * circleLength
    result.push({
      key: 'unsolved',
      type: 'unsolved',
      color: GREY_COLOR,
      startFraction: offsetFraction,
      fraction: unsolvedFraction,
      dasharray: `${length} ${Math.max(circleLength - length, 0)}`,
      dashoffset: circleLength * (1 - offsetFraction),
      solved: unsolvedCount,
      total,
    })
  }

  return result
})

const passRate = computed(() => {
  if (props.summary.submitCount <= 0) {
    return 0
  }
  return props.summary.passCount / props.summary.submitCount
})

const displayLabel = computed(() => (isHovering.value ? '通过率' : '已通过'))

const centerState = computed<CenterState>(() => {
  if (isHovering.value) {
    return {
      mode: 'rate',
      rate: formatPercent(passRate.value),
    }
  }
  return {
    mode: 'fraction',
    numerator: totalSolved.value,
    denominator: totalProblems.value,
  }
})

const handleMouseEnter = () => {
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}
</script>

<template>
  <div class="flex items-start justify-between gap-4 w-full px-[15px]">
    <div
      class="relative flex justify-center items-center cursor-pointer"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <svg
        class="block"
        :viewBox="`0 0 ${viewBoxSize} ${viewBoxSize}`"
        role="img"
        aria-hidden="true"
        :style="{ width: `${chartSize}px`, height: `${chartSize}px` }"
      >
        <circle
          v-if="totalProblems === 0"
          class="block"
          fill="transparent"
          :cx="center"
          :cy="center"
          :r="radius"
          :stroke-width="strokeWidth"
          :transform="`rotate(-90 ${center} ${center})`"
        />
        <template v-else>
          <circle
            class="block"
            fill="transparent"
            :cx="center"
            :cy="center"
            :r="radius"
            :stroke-width="strokeWidth"
            :transform="`rotate(-90 ${center} ${center})`"
          />
          <circle
            v-for="(segment, index) in segments"
            :key="`${segment.key}-${segment.type}-${index}`"
            class="segment"
            :class="{ 'segment--static': segment.type === 'unsolved' }"
            fill="transparent"
            :cx="center"
            :cy="center"
            :r="radius"
            :stroke="segment.color"
            :stroke-width="strokeWidth"
            :stroke-dasharray="segment.dasharray"
            :stroke-dashoffset="segment.dashoffset"
            stroke-linecap="butt"
            :transform="`rotate(-90 ${center} ${center})`"
          />
        </template>
      </svg>
      <div class="chart-center">
        <template v-if="centerState.mode === 'rate'">
          <div>
            <span class="center-value">{{
              centerState.rate.split('.')[0]
            }}</span>
            <span class="text-xs">.{{ centerState.rate.split('.')[1] }} </span>
          </div>

          <div class="center-value"></div>
        </template>
        <template v-else>
          <div>
            <span class="center-value">{{ centerState.numerator }}</span>
            <span class="text-xs">/{{ centerState.denominator }} </span>
          </div>
        </template>
        <div class="center-label">{{ displayLabel }}</div>
      </div>
    </div>
    <div class="difficulty-list">
      <div
        v-for="row in difficultyDetails"
        :key="row.key"
        class="difficulty-item"
        :style="{ backgroundColor: row.background }"
      >
        <span class="difficulty-name" :style="{ color: row.color }">
          {{ row.label }}
        </span>
        <span class="difficulty-count"> {{ row.solved }}/{{ row.total }} </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.segment {
  transition: stroke-dashoffset 0.4s ease;
}

.segment--static {
  pointer-events: none;
}

.chart-center {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.center-value {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
  color: #0f172a;
}

.center-label {
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
}

.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 0;
}

.difficulty-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  min-width: 80px;
  border-radius: 6px;
  box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.08);
}

.difficulty-name {
  font-size: 12px;
}

.difficulty-count {
  font-size: 12px;
  color: #0f172a;
}
</style>
