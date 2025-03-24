<template>
  <div class="px-5 w-full bg-gray-100">
    <div class="max-w-[1160px] mx-auto">
      <BreadCrumb></BreadCrumb>
      <a-card>
        <router-view></router-view>
      </a-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/stores'
import { Message } from '@arco-design/web-vue'
import { useRouter } from 'vue-router'
import BreadCrumb from './components/BreadCrumb.vue'

const router = useRouter()
const userStore = useUserStore()

console.log('获取用户权限')

if (userStore.userInfo?.userRole !== 'admin') {
  router.push({ name: 'problemset' })
  Message.error({
    content: '无权限访问',
    duration: 5 * 1000,
  })
}
</script>
