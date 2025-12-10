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
        <a-list-item
          v-for="record in dataSource.records"
          :key="record.id"
          :class="record.id === problemId ? 'bg-gray-200' : ''"
        >
          <div class="flex items-center justify-between w-full">
            <!-- 左侧：状态图标和题目ID、名称 -->
            <div class="flex items-center space-x-2">
              <span>
                <SolvedIcon
                  v-if="record.status === ProblemStatusEnum.SOLVED"
                  class="text-solved"
                />
                <TriedIcon
                  v-else-if="record.status === ProblemStatusEnum.TRIED"
                  class="text-medium"
                />
                <span v-else class="inline-block w-[18px]"></span>
              </span>
              <router-link
                class="hover:text-blue-500 font-medium"
                :to="`/problem/${record.id}`"
              >
                <span>{{ record.id }}. {{ record.title }}</span>
              </router-link>
            </div>
            <!-- 右侧：题目难度 -->
            <div class="flex items-center">
              <span
                :class="{
                  'text-easy': record.difficulty === '简单',
                  'text-medium': record.difficulty === '中等',
                  'text-hard': record.difficulty === '困难',
                }"
              >
                {{ record.difficulty }}
              </span>
            </div>
          </div>
        </a-list-item>
      </a-list>
    </div>
  </a-drawer>
</template>

<script setup lang="ts">
import type { Page } from '@/api/common/types'
import { getPrevNextProblemId, listSafeProblemVoByPage } from '@/api/problem'
import { ProblemStatusEnum } from '@/api/problem/constants'
import type { SafeProblemVo } from '@/api/problem/types'
import SolvedIcon from '@/components/icons/SolvedIcon.vue'
import TriedIcon from '@/components/icons/TriedIcon.vue'
import router from '@/router'
import { Message } from '@arco-design/web-vue'
import { get } from 'lodash'
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const visible = ref(false)
const route = useRoute()
const problemId = computed(() => Number(route.params.problemId))
let drawerBody: HTMLElement | null = null
const dataSource = ref<Page<SafeProblemVo>>({
  records: [],
  total: 0,
  size: 20,
  current: 1,
})
const isLoading = ref(false)

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

const initDataSource = () => {
  isLoading.value = true
  listSafeProblemVoByPage({ current: 1, size: dataSource.value.size }).then(
    res => {
      dataSource.value = res.data.data
      isLoading.value = false
    },
  )
}

const loadMore = () => {
  // 加载新数据的逻辑
  console.log('加载更多数据')

  if (isLoading.value) return
  // 判断是否还有下一页
  if (dataSource.value.records.length >= dataSource.value.total) {
    return
  }
  isLoading.value = true
  const nextPage = dataSource.value.current + 1
  listSafeProblemVoByPage({
    current: nextPage,
    size: dataSource.value.size,
  }).then(res => {
    // 拼接新数据
    dataSource.value.records = dataSource.value.records.concat(
      res.data.data.records,
    )
    dataSource.value.current = nextPage
    dataSource.value.total = res.data.data.total
    isLoading.value = false
  })
}

const onScroll = () => {
  if (!drawerBody) return
  const { scrollTop, scrollHeight, clientHeight } = drawerBody
  if (scrollTop + clientHeight == scrollHeight) {
    loadMore()
  }
}

// 监听 visible 变化，弹窗打开时绑定事件
watch(visible, val => {
  if (val) {
    // 首次加载
    if (dataSource.value.records.length === 0) {
      initDataSource()
    }

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
