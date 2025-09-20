import { createApp } from 'vue'

import './style.css'
import App from './App.vue'
import { pinia } from './src/stores'

async function setupApp() {
  const app = createApp(App)

  app.use(pinia)

  app.mount('#app')
}

setupApp()
