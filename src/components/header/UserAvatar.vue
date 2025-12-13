<template>
  <a-popover position="br" trigger="click" :arrow-style="{ display: 'none' }"
    :content-style="{ width: '130px', padding: '4px 8px 8px' }">
    <a-avatar :size="24" class="cursor-pointer">
      <img :src="DEFAULT_AVATAR" />
    </a-avatar>
    <template #content>
      <div @click="getSetAKSK" class="flex items-center w-full hover:bg-gray-100 rounded-s px-3 py-1 cursor-pointer">
        <icon-lock class="text-base" />
        <span class="pl-2">API 密钥</span>
      </div>
      <div @click="() => userStore.logout()"
        class="flex items-center w-full hover:bg-gray-100 rounded-s px-3 py-1 cursor-pointer">
        <icon-export class="text-base" />
        <span class="pl-2">退出</span>
      </div>
    </template>
  </a-popover>
</template>

<script setup lang="ts">
import { getAKSK } from '@/api/user';
import { DEFAULT_AVATAR } from '@/config/config';
import { useUserStore } from '@/stores';
import { Message } from '@arco-design/web-vue';

const userStore = useUserStore()

const getSetAKSK = () => {
  getAKSK().then(res => {
    const ak = res.data.data.accessKey;
    const sk = res.data.data.secretKey;

    const text = `accessKey: ${ak}\nsecretKey: ${sk}`;
    navigator.clipboard.writeText(text);
    Message.success('密钥已复制到剪切板，请妥善保管');
  }).catch(() => {
    Message.error('获取密钥失败');
  });
}
</script>
