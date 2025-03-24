<template>
  <div class="button-container flex items-center space-x-[1px]">
    <a-button class="group-button" @click="visible = true" :style="{
      padding: '0 8px',
      color: 'black',
      display: 'flex',
      alignItems: 'center',
      lineHeight: '1',
    }" type="text">
      <template #icon>
        <icon-menu-unfold class="text-lg" />
      </template>
      题库
    </a-button>

    <a-button class="group-button" :style="{ color: 'black' }" type="text">
      <template #icon>
        <icon-left />
      </template>
    </a-button>

    <a-button class="group-button" :style="{ color: 'black' }" type="text">
      <template #icon>
        <icon-right />
      </template>
    </a-button>
  </div>


  <a-drawer :footer="false" :width="600" :height="340" :visible="visible" placement="left" @ok="visible = false"
    @cancel="visible = false" unmountOnClose>
    <template #title> 题库 </template>
    <div>
      <a-list>
        <template #header> List title </template>
        <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>

        <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Bytedance Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Toutiao Technology Co., Ltd.</a-list-item>
        <a-list-item>Beijing Volcengine Technology Co., Ltd.</a-list-item>
        <a-list-item>China Beijing Bytedance Technology Co., Ltd.</a-list-item>
      </a-list>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref(false)

</script>


<style scoped>
/* 悬停在 button-container 时，所有按钮背景变灰 */
.button-container:hover .group-button:not(:hover) {
  background-color: #e7e7e7;
}

/* 当前悬停的按钮背景更深 */
.group-button:hover {
  background-color: #e2e2e2;
}
</style>
