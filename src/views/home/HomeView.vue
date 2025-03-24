<script setup lang="ts">
import { ref } from 'vue'
import CheckIn from './components/CheckIn.vue'
import ProblemTable from './components/ProblemTable.vue'

const date = ref<Date>(new Date())
</script>

<template>
  <div class="mx-auto max-w-[1200px] min-w-[820px] px-6 py-6">
    <div class="grid gap-6 grid-cols-3 lg:grid-cols-4">
      <div class="col-span-2 lg:col-span-3">
        <a-space direction="vertical" size="large" fill>
          <problem-table />
        </a-space>
      </div>
      <div class="col-span-1">
        <check-in :date="date" />
      </div>
    </div>
  </div>
</template>
