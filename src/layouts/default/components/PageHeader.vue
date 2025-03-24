<script setup lang="ts">
import SearchBox from '@/components/header/SearchBox.vue'
import UserAvatar from '@/components/header/UserAvatar.vue'
import { useUserStore } from '@/stores'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const userStore = useUserStore()

const menu = computed(() => {
  const routes = [
    {
      name: '题库',
      path: '/problemset',
    },
  ]

  if (userStore.userInfo?.userRole === 'admin') {
    routes.push({
      name: '管理',
      path: '/admin',
    })
  }
  return routes
})

const activePath = computed(() => {
  if (route.path.startsWith('/problemset')) {
    return '/problemset'
  } else if (route.path.startsWith('/admin')) {
    return '/admin'
  } else {
    return '/problemset'
  }
})
</script>

<template>
  <nav class="flex h-[50px] w-full min-w-[820px] justify-center border-b-[1px]">
    <div class="mx-auto flex h-full w-full items-center px-6 max-w-[1200px]">
      <router-link to="/" class="mr-8">
        <span class="h-[22px]">
          <img class="h-[22px] object-cover" src="/favicon.svg" alt="logo" />
        </span>
      </router-link>

      <ul class="flex h-full flex-grow gap-6">
        <li v-for="item in menu" :key="item.name" class="flex h-full text-sm">
          <router-link :class="[
            activePath == item.path ? 'text-gray-800' : 'text-gray-400',
          ]" class="hover:text-gray-800 flex items-center text-base cursor-pointer" :to="item.path">
            {{ item.name }}
          </router-link>
        </li>
      </ul>

      <a-space direction="horizontal">
        <search-box />
        <user-avatar />
      </a-space>
    </div>
  </nav>
</template>
