<template>
  <div class="py-4">
    <a-breadcrumb>
      <!-- 动态渲染面包屑项 -->
      <a-breadcrumb-item v-for="(item, index) in breadcrumbItems" :key="index">
        <!-- 第一个或最后一个显示为文本 -->
        <template v-if="index === 0 || index === breadcrumbItems.length - 1">
          {{ item.text }}
        </template>
        <!-- 其他显示为链接 -->
        <template v-else>
          <router-link :to="item.to">{{ item.text }}</router-link>
        </template>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// 获取当前路由信息
const route = useRoute()

// 动态生成面包屑数据
const breadcrumbItems = computed(() => {
  const items = [{ text: '管理', to: '/admin' }]

  // 根据当前路径生成面包屑
  if (route.path.includes('/problemset')) {
    items.push({ text: '题库', to: '/admin/problemset' })
  }
  if (route.path === '/admin/problemset/add') {
    items.push({ text: '新建', to: '/admin/problemset/add' })
  } else if (route.path.startsWith('/admin/problemset/edit')) {
    items.push({ text: '编辑', to: '/admin/problemset/edit' })
  }

  return items
})
</script>
