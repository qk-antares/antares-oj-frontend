<template>
  <div class="mx-4 my-2">
    <a-form :model="problem" layout="horizontal" auto-label-width>
      <a-form-item field="title" label="标题：">
        <a-input v-model="problem.title" placeholder="请输入问题标题" />
      </a-form-item>

      <a-form-item class="justify-center" field="tags" label="标签：">
        <a-space direction="horizontal">
          <a-tag
            v-for="tag in problem.tags"
            :key="tag"
            :closable="true"
            @close="handleTagRemove(tag)"
          >
            {{ tag }}
          </a-tag>

          <a-input
            v-if="showTagInput"
            ref="tagInputRef"
            :style="{ width: '80px' }"
            size="mini"
            v-model.trim="tagInputVal"
            @keyup.enter="handleTagAdd"
            @blur="handleTagAdd"
          />
          <a-tag
            v-else
            class="w-20 bg-gray-100 border-gray-300 cursor-pointer"
            @click="handleTagEdit"
          >
            <template #icon>
              <icon-plus />
            </template>
            新建
          </a-tag>
        </a-space>
      </a-form-item>

      <a-form-item field="difficulty" label="难度：">
        <a-select v-model="problem.difficulty" placeholder="难度">
          <a-option value="简单">简单</a-option>
          <a-option value="中等">中等</a-option>
          <a-option value="困难">困难</a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="content" label="题目描述：">
        <div id="content" />
      </a-form-item>

      <a-form-item field="answer" label="题解：">
        <div id="answer" />
      </a-form-item>

      <a-form-item field="judgeCase" label="测试用例：">
        <test-case-table v-model:cases="problem.judgeCase" />
      </a-form-item>

      <a-form-item field="difficulty" label="时间限制：">
        <a-input-number
          v-model="problem.judgeConfig.timeLimit"
          :min="1"
          :max="1000"
          :style="{ width: '200px' }"
          placeholder="请输入时间限制"
        >
          <template #append> ms </template>
        </a-input-number>
      </a-form-item>

      <a-form-item field="difficulty" label="内存限制：">
        <a-input-number
          :min="1"
          :max="128"
          v-model="problem.judgeConfig.memoryLimit"
          :style="{ width: '200px' }"
          placeholder="请输入内存限制"
        >
          <template #append> MB </template>
        </a-input-number>
      </a-form-item>

      <a-form-item>
        <a-button
          v-if="operation === 'add'"
          type="primary"
          @click="handleProblemAdd"
          >创建</a-button
        >
        <a-button
          v-if="operation === 'edit'"
          type="primary"
          @click="handleProblemUpdate"
          >更新</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { addProblem, getProblemVoById, updateProblem } from '@/api/problem'
import type { ProblemAddReq } from '@/api/problem/types'
import { Message } from '@arco-design/web-vue'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { nextTick, onMounted, reactive, ref, toRaw } from 'vue'
import { useRouter } from 'vue-router'
import TestCaseTable from './ProblemEditor/TestCaseTable.vue'

const { operation, problemId } = defineProps<{
  operation: 'add' | 'edit'
  problemId?: number
}>()

const router = useRouter()
const tagInputRef = ref<HTMLInputElement | null>(null)
const showTagInput = ref(false)
const tagInputVal = ref<string>('')
const contentVditor = ref<Vditor | null>(null)
const answerVditor = ref<Vditor | null>(null)

const problem = reactive<ProblemAddReq>({
  title: '',
  tags: [],
  difficulty: '简单',
  content: '',
  answer: '',
  judgeCase: [],
  judgeConfig: {
    timeLimit: 1000,
    memoryLimit: 128,
  },
})

onMounted(async () => {
  if (operation === 'edit' && problemId) {
    const res = await getProblemVoById(problemId) // 等待问题数据加载
    Object.assign(problem, res.data.data) // 更新问题内容
  }

  nextTick(() => {
    contentVditor.value = new Vditor('content', {
      height: 500,
      preview: {
        theme: {
          current: 'ant-design',
        },
      },
      after: () => {
        contentVditor.value!.setValue(problem.content)
      },
    })

    answerVditor.value = new Vditor('answer', {
      height: 500,
      preview: {
        theme: {
          current: 'ant-design',
        },
      },
      after: () => {
        answerVditor.value!.setValue(problem.answer)
      },
    })
  })
})

const handleTagEdit = () => {
  showTagInput.value = true

  nextTick(() => {
    if (tagInputRef.value) {
      tagInputRef.value.focus()
    }
  })
}

const handleTagAdd = () => {
  if (tagInputVal.value) {
    problem.tags.push(tagInputVal.value)
    tagInputVal.value = ''
  }
  showTagInput.value = false
}

const handleTagRemove = (removeTag: string) => {
  problem.tags = problem.tags.filter(tag => tag !== removeTag)
}

const handleProblemAdd = () => {
  addProblem({
    ...toRaw(problem),
    content: contentVditor.value!.getValue(),
    answer: answerVditor.value!.getValue(),
  }).then(() => {
    Message.success({
      content: '创建成功',
      duration: 3000,
    })

    // 跳转到指定页面，例如问题列表页
    router.push({ name: 'adminProblemsetTable' }) // 假设在路由配置中定义了该路由名称
  })
}

const handleProblemUpdate = () => {
  updateProblem({
    ...toRaw(problem),
    id: problemId || 0,
    content: contentVditor.value!.getValue(),
    answer: answerVditor.value!.getValue(),
  }).then(() => {
    Message.success({
      content: '更新成功',
      duration: 3000,
    })
  })

  // 跳转到指定页面，例如问题列表页
  router.push({ name: 'adminProblemsetTable' }) // 假设在路由配置中定义了该路由名称
}
</script>

<style scoped>
:deep(.vditor-toolbar) {
  width: 100%;
}
:deep(.vditor-content) {
  width: 100%;
}
</style>
