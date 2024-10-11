/** 重置样式 */
import '@/styles/reset.css'
import 'uno.css'
import '@/styles/global.scss'
import 'virtual:svg-icons-register'

import { createApp } from 'vue'
import { setupStore } from '@/store'
import App from './App.vue'
import { setupNaiveDiscreteApi } from './utils'

async function setupApp() {
  const app = createApp(App)

  setupStore(app)
  setupNaiveDiscreteApi()

  app.mount('#app')
}

setupApp()
