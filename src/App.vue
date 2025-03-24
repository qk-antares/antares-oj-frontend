<script setup lang="ts">
import DefaultLayout from '@/layouts/default/DefaultLayout.vue'
import CustomLayout from '@/layouts/problem/ProblemLayout.vue'
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import NoneLayout from './layouts/none/NoneLayout.vue'

const route = useRoute()

const layout = computed(() => {
  switch (route.meta.layout) {
    case 'login':
      return NoneLayout
    case 'problem':
      return CustomLayout
    default:
      return DefaultLayout
  }
})
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
