<template>
  <div class="p-1">
    <LangSelect />

    <div class="float-right">
      <a-tooltip content="还原到默认代码模板" position="tr" mini>
        <a-button @click="resetCode" class="!w-6 !h-6 mr-1" type="text">
          <template #icon>
            <icon-refresh />
          </template>
        </a-button>
      </a-tooltip>

      <a-tooltip content="保存" position="tr" mini>
        <a-button @click="saveCode" class="!w-6 !h-6" type="text">
          <template #icon>
            <icon-save />
          </template>
        </a-button>
      </a-tooltip>
    </div>
  </div>

  <DividerLine />

  <div class="pb-1 px-1" :style="{ height: 'calc(100% - 32px)' }">
    <MonacoEditor />
  </div>
</template>

<script setup lang="ts">
import DividerLine from '@/components/common/DividerLine.vue'
import { Message } from '@arco-design/web-vue'
import LangSelect from './CodePanel/LangSelect.vue'
import MonacoEditor from './CodePanel/MonacoEditor.vue'

const resetCode = () => {
  Message.info('暂未实现')
}

const saveCode = () => {
  Message.info('暂未实现')
}
</script>
