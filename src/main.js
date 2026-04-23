import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from '@/router/index.js'
import vuetify from '@/plugins/vuetify.js'
import '@mdi/font/css/materialdesignicons.css'
import '@/assets/styles/main.css'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
