// src/utils/iconfont.js
import { Icon } from '@arco-design/web-vue'

// 使用 iconfont.cn 提供的链接，创建一个全局的 IconFont 组件
export const IconFont = Icon.addFromIconFontCn({
  src: 'https://at.alicdn.com/t/c/font_4740341_59sah8us8y3.js',
})

export default IconFont
