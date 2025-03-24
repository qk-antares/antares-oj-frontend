import ArcoVue from '@arco-design/web-vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import './assets/index.css'

import '@/api/common/interceptor'
import App from './App.vue'
import router from './router'

if (import.meta.env.MODE === 'development') {
  await import('./mock')
}

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ArcoVue)

app.mount('#app')
