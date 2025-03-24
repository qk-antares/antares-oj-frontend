<template>
  <a-space direction="vertical" size="large" style="width: 100%" fill>
    <div class="flex gap-3">
      <div class="w-20">
        <a-button
          class="w-full"
          type="primary"
          @click="
            () => {
              router.push('/admin/problemset/add')
            }
          "
        >
          <template #icon>
            <icon-plus />
          </template>
          新建
        </a-button>
      </div>

      <div class="w-24">
        <SingleSelector
          v-model="difficulty"
          :options="['简单', '中等', '困难']"
          placeholder="难度"
        />
      </div>

      <div class="w-24">
        <TagsSelector v-model="selectedTags" :tags="tags" />
      </div>

      <div class="grow">
        <a-input-search
          v-model="keyword"
          class="float-right max-w-[400px]"
          placeholder="搜索题目、编号或内容"
          @search="fetchProblemPage(1)"
        />
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
          fetchProblemPage(page, dataSource.size)
        }
      "
      @page-size-change="
        pageSize => {
          fetchProblemPage(1, pageSize)
        }
      "
      :columns="columns"
      :data="dataSource.records"
      :hoverable="false"
      :stripe="true"
    >
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

      <template #judgeConfig="{ record }">
        <div class="flex flex-wrap gap-1 justify-center">
          <a-tag bordered>
            <template #icon>
              <icon-clock-circle />
            </template>
            {{ record.judgeConfig.timeLimit }}ms</a-tag
          >
          <a-tag bordered>
            <template #icon>
              <icon-font type="icon-neicun" />
            </template>
            {{ record.judgeConfig.memoryLimit }}MB</a-tag
          >
        </div>
      </template>

      <template #createTime="{ record }">
        {{ dayjs(record.createTime).format('YYYY.MM.DD HH:mm:ss') }}
      </template>

      <template #operations="{ record }">
        <a-button
          type="text"
          @click="
            () => {
              router.push(`/admin/problemset/edit/${record.id}`)
            }
          "
        >
          <template #icon>
            <icon-edit />
          </template>
        </a-button>

        <a-popconfirm content="确定要删除该题目吗？">
          <a-button type="text">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </a-space>
</template>

<script setup lang="ts">
import type { Page } from '@/api/common/types'
import { getProblemTags, listProblemVoByPage } from '@/api/problem'
import type { ProblemVo } from '@/api/problem/types'
import SingleSelector from '@/components/common/SingleSelector.vue'
import TagsSelector from '@/components/common/TagsSelector.vue'
import IconFont from '@/utils/iconfont'
import type { TableColumnData } from '@arco-design/web-vue'
import dayjs from 'dayjs'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const columns: TableColumnData[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    align: 'center',
  },
  {
    title: '题目',
    align: 'center',
    dataIndex: 'title',
  },
  {
    title: '标签',
    align: 'center',
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
  {
    title: '判题配置',
    align: 'center',
    dataIndex: 'judgeConfig',
    slotName: 'judgeConfig',
  },
  {
    title: '创建时间',
    align: 'center',
    dataIndex: 'createTime',
    slotName: 'createTime',
  },
  {
    title: '操作',
    align: 'center',
    slotName: 'operations',
  },
]

const router = useRouter()
const difficulty = ref()
const tags = ref<string[]>([])
const selectedTags = ref<string[]>([])
const keyword = ref<string>('')
const dataSource = ref<Page<ProblemVo>>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
})

const fetchProblemPage = (current?: number, size?: number) => {
  listProblemVoByPage({
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
  fetchProblemPage(dataSource.value.current, dataSource.value.size)
  getProblemTags().then(res => {
    tags.value = res.data.data
  })
})

watch([difficulty, selectedTags], () => fetchProblemPage(), { deep: true })
</script>

<style scoped>
:deep(.arco-table .arco-table-cell) {
  padding: 9px 4px;
}
</style>
