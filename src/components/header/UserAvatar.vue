<template>
  <a-popover position="br" trigger="click" :arrow-style="{ display: 'none' }"
    :content-style="{ width: '150px', padding: '8px' }">
    <a-avatar :size="24" class="cursor-pointer">
      <img :src="DEFAULT_AVATAR" />
    </a-avatar>
    <template #content>
      <div class="flex items-center w-full hover:bg-gray-100 rounded-s px-2 py-[10px] cursor-pointer">
        <icon-font type="icon-key" class="text-lg" />
        <span class="pl-3">API密钥</span>
      </div>
      <div class="flex items-center w-full hover:bg-gray-100 rounded-s px-2 py-[10px] cursor-pointer">
        <icon-export class="text-lg" />
        <span class="pl-3">退出</span>
      </div>
    </template>
  </a-popover>


</template>

<script setup lang="ts">
import { DEFAULT_AVATAR } from '@/config/config';
import IconFont from '@/utils/iconfont';

</script>
