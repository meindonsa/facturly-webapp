import "@/core/main.css";
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from '@/core/router'
import { setupInterceptors } from '@/core/lib/interceptors.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)

setupInterceptors(() => {
  router.push('/auth/login')
})

app.mount('#app')
