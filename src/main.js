import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router';
import store from '@/store';
import '@/assets/style/index.scss'
import ElementPlus from '@/plugins/ElementPlus'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
