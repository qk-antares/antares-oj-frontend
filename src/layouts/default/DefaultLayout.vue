<script setup lang="ts">
import PageFooter from '@/layouts/default/components/PageFooter.vue';
import PageHeader from '@/layouts/default/components/PageHeader.vue';
</script>

<template>
  <PageHeader />
  <slot />
  <PageFooter />
</template>
