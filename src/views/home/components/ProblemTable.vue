<template>
  <a-space direction="vertical" size="large" style="width: 100%" fill>
    <div class="flex gap-2">
      <div class="w-24">
        <SingleSelector
          v-model="difficulty"
          :options="['简单', '中等', '困难']"
          placeholder="难度"
        />
      </div>

      <div class="w-24">
        <SingleSelector
          v-model="status"
          :options="['未开始', '已解答', '尝试过']"
          placeholder="状态"
        />
      </div>

      <div class="w-24">
        <TagsSelector v-model="selectedTags" :tags="tags" />
      </div>

      <div class="grow">
        <a-input-search placeholder="搜索题目、编号或内容" />
      </div>
    </div>

    <a-table
      :pagination="{
        showPageSize: true,
        pageSizeOptions: [10, 20, 30, 40, 50],
        total: dataSource.total,
        current: dataSource.current,
        pageSize: dataSource.size,
      }"
      @page-change="
        page => {
          fetchSafeProblemPage(page, dataSource.size)
        }
      "
      @page-size-change="
        pageSize => {
          fetchSafeProblemPage(1, pageSize)
        }
      "
      :columns="columns"
      :data="dataSource.records"
      :hoverable="false"
      :stripe="true"
    >
      <template #status="{ record }">
        <SolvedIcon
          v-if="record.status === ProblemStatusEnum.SOLVED"
          class="text-solved"
        />
        <TriedIcon
          v-else-if="record.status === ProblemStatusEnum.TRIED"
          class="text-medium"
        />
      </template>

      <template #title="{ record }">
        <router-link class="hover:text-blue-500" :to="`/problem/${record.id}`"
          >{{ record.id }}. {{ record.title }}</router-link
        >
      </template>

      <template #tags="{ record }">
        <a-space>
          <a-tag bordered color="blue" v-for="tag in record.tags" :key="tag">{{
            tag
          }}</a-tag>
        </a-space>
      </template>

      <template #passRate="{ record }">
        {{ ((record.acceptedNum / (record.submitNum | 1)) * 100).toFixed(1) }}%
      </template>

      <template #difficulty="{ record }">
        {{ record.difficulty }}
      </template>
    </a-table>
  </a-space>
</template>

<script setup lang="ts">
import type { Page } from '@/api/common/types'
import { getProblemTags, listSafeProblemVoByPage } from '@/api/problem'
import { ProblemStatusEnum } from '@/api/problem/constants'
import type { SafeProblemVo } from '@/api/problem/types'
import SingleSelector from '@/components/common/SingleSelector.vue'
import TagsSelector from '@/components/common/TagsSelector.vue'
import SolvedIcon from '@/components/icons/SolvedIcon.vue'
import TriedIcon from '@/components/icons/TriedIcon.vue'
import type { TableColumnData } from '@arco-design/web-vue'
import { onMounted, ref, watch } from 'vue'

const columns: TableColumnData[] = [
  {
    title: '状态',
    dataIndex: 'status',
    slotName: 'status',
    align: 'center',
  },
  {
    title: '题目',
    dataIndex: 'title',
    slotName: 'title',
  },
  {
    title: '标签',
    dataIndex: 'tags',
    slotName: 'tags',
  },
  {
    title: '通过率',
    dataIndex: 'passRate',
    slotName: 'passRate',
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    slotName: 'difficulty',
  },
]

const difficulty = ref<string>()
const status = ref<string>()
const tags = ref<string[]>([])
const selectedTags = ref<string[]>([])
const keyword = ref<string>('')
const dataSource = ref<Page<SafeProblemVo>>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
})

const fetchSafeProblemPage = (current?: number, size?: number) => {
  listSafeProblemVoByPage({
    current: current ?? dataSource.value.current,
    size: size ?? dataSource.value.size,
    difficulty: difficulty.value,
    tags: selectedTags.value,
    keyword: keyword.value,
  }).then(res => {
    dataSource.value = res.data.data
  })
}

onMounted(() => {
  fetchSafeProblemPage(dataSource.value.current, dataSource.value.size)
  getProblemTags().then(res => {
    tags.value = res.data.data
  })
})

watch([difficulty, selectedTags], () => fetchSafeProblemPage(), { deep: true })
</script>

<style scoped>
:deep(.arco-table .arco-table-cell) {
  padding: 9px 4px;
}
</style>
