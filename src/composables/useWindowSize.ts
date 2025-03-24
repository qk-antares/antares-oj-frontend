import { onMounted, onUnmounted, ref } from 'vue'

export function useWindowSize() {
  const pageWidth = ref(window.innerWidth) // 页面宽度
  const pageHeight = ref(window.innerHeight) // 页面高度

  // 更新宽度和高度的方法
  const updateDimensions = () => {
    pageWidth.value = window.innerWidth
    pageHeight.value = window.innerHeight
  }

  // 监听窗口尺寸变化
  onMounted(() => {
    window.addEventListener('resize', updateDimensions)
  })

  // 组件卸载时移除事件监听
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
  })

  // 返回响应式的数据
  return {
    pageWidth,
    pageHeight,
  }
}
