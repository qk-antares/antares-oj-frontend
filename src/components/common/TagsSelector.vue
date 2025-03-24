<template>
  <a-popover
    position="bl"
    trigger="click"
    :arrow-style="{ display: 'none' }"
    :content-style="{ width: '300px', padding: '10px' }"
  >
    <a-select :popup-visible="false" placeholder="标签"> </a-select>
    <template #content>
      <div class="flex flex-wrap gap-2">
        <a-tag
          v-for="tag in tags"
          :key="tag"
          @click="toggleTag(tag)"
          class="cursor-pointer"
          :color="selectedTags.includes(tag) ? '#165DFF' : undefined"
        >
          {{ tag }}
        </a-tag>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
const selectedTags = defineModel<string[]>({ default: [] })

defineProps<{
  tags: string[]
}>()

// 切换标签的选中状态
const toggleTag = (tag: string): void => {
  if (selectedTags.value.includes(tag)) {
    // 如果已经选中，则移除
    const index = selectedTags.value.indexOf(tag)
    if (index !== -1) {
      selectedTags.value.splice(index, 1)
    }
  } else {
    // 如果未选中，则添加
    selectedTags.value.push(tag)
  }
}
</script>
