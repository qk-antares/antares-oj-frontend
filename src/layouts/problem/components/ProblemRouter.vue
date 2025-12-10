<template>
  <div class="button-container flex items-center space-x-[1px]">
    <a-button
      class="group-button"
      @click="visible = true"
      :style="{
        padding: '0 8px',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        lineHeight: '1',
      }"
      type="text"
    >
      <template #icon>
        <icon-menu-unfold class="text-lg" />
      </template>
      题库
    </a-button>

    <a-button
      @click="goPrevNext('prev')"
      class="group-button"
      :style="{ color: 'black' }"
      type="text"
    >
      <template #icon>
        <icon-left />
      </template>
    </a-button>

    <a-button
      @click="goPrevNext('next')"
      class="group-button"
      :style="{ color: 'black' }"
      type="text"
    >
      <template #icon>
        <icon-right />
      </template>
    </a-button>
  </div>

  <a-drawer
    :footer="false"
    :width="600"
    :height="340"
    :visible="visible"
    placement="left"
    @ok="visible = false"
    @cancel="visible = false"
    unmountOnClose
  >
    <template #title> 题库 </template>
    <div>
      <a-list>
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
import { getPrevNextProblemId } from '@/api/problem'
import router from '@/router'
import { Message } from '@arco-design/web-vue'
import { get } from 'lodash'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const visible = ref(false)
const route = useRoute()
const problemId = computed(() => Number(route.params.problemId))
let drawerBody: HTMLElement | null = null

const goPrevNext = (direction: 'prev' | 'next') => {
  getPrevNextProblemId(problemId.value, direction).then(res => {
    const newProblemId = get(res, 'data.data', null)
    if (newProblemId) {
      router.push({ name: 'problem', params: { problemId: newProblemId } })
    } else {
      Message.info('没有更多题目了')
    }
  })
}

const loadMore = () => {
  // 加载新数据的逻辑
  console.log('加载更多数据')
}

const onScroll = () => {
  if (!drawerBody) return
  const { scrollTop, scrollHeight, clientHeight } = drawerBody
  if (scrollTop + clientHeight == scrollHeight) {
    loadMore()
  }
}

onMounted(() => {
  // 监听 visible 变化，弹窗打开时绑定事件
  watch(visible, val => {
    if (val) {
      setTimeout(() => {
        drawerBody = document.querySelector('.arco-drawer-body')
        if (drawerBody) {
          drawerBody.addEventListener('scroll', onScroll)
        }
      }, 0)
    } else {
      if (drawerBody) {
        drawerBody.removeEventListener('scroll', onScroll)
        drawerBody = null
      }
    }
  })
})

onUnmounted(() => {
  if (drawerBody) {
    drawerBody.removeEventListener('scroll', onScroll)
  }
})
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
