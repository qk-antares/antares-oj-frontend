<template>
  <div ref="editorContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { CODE_TEMPLATE } from '@/config/config'
import debounce from 'lodash/debounce'
import * as monaco from 'monaco-editor'
import { inject, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

const code = inject<Ref<string>>('code', ref(CODE_TEMPLATE))
const language = inject<Ref<string>>('language', ref('Java'))

const editorContainer = ref<HTMLDivElement | null>(null)
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// 初始化编辑器
onMounted(async () => {
  if (editorContainer.value) {
    editor = monaco.editor.create(editorContainer.value, {
      value: code.value,
      language: language.value.toLowerCase(),
      theme: 'vs-light',
      automaticLayout: true,
      scrollBeyondLastLine: false,
      scrollbar: {
        horizontalScrollbarSize: 8,
        verticalScrollbarSize: 8,
      },
      minimap: {
        enabled: false,
      },
    })

    // 使用 lodash 的 debounce，延迟 500ms
    const updateCode = debounce((newCode: string) => {
      code.value = newCode
    }, 500)

    editor.onDidChangeModelContent(() => {
      updateCode(editor?.getValue() || '') // 防抖调用
    })
  }
})

// 清理编辑器
onBeforeUnmount(() => {
  if (editor) {
    editor.dispose()
  }
})
</script>
