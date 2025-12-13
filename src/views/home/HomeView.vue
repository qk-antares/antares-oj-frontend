<script setup lang="ts">
import { getSubmitSummary } from '@/api/problem'
import type { SubmitSummaryVo } from '@/api/problem/types'
import { onMounted, ref } from 'vue'
import CheckIn from './components/CheckIn.vue'
import ProblemTable from './components/ProblemTable.vue'
import RingStats from './components/RingStats.vue'

const submitSummaryVo = ref({} as SubmitSummaryVo)

onMounted(() => {
  getSubmitSummary().then(res => {
    submitSummaryVo.value = res.data.data
  })
})
</script>

<template>
  <div class="mx-auto max-w-[1200px] min-w-[900px] px-6 py-6">
    <div class="grid gap-6 grid-cols-3 lg:grid-cols-4">
      <div class="col-span-2 lg:col-span-3">
        <a-space direction="vertical" size="large" fill>
          <problem-table />
        </a-space>
      </div>
      <div class="col-span-1">
        <a-card :content-style="{ padding: '0px' }" class="drop-shadow-sm">
          <check-in />

          <a-divider />

          <ring-stats :summary="submitSummaryVo" />
        </a-card>
      </div>
    </div>
  </div>
</template>
