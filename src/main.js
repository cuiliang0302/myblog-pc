import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router';
import store from '@/store';
import mitt from 'mitt'
import '@/assets/style/index.scss'
import animate from "animate.css";
import ElementPlus from '@/plugins/ElementPlus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/style/css-vars.css'
import "@/assets/style/normalize.css";
import "@/assets/style/hover-min.css";
import 'nprogress/nprogress.css'
import 'vue-loaders/dist/vue-loaders.css';
import VueLoaders from 'vue-loaders';

const app = createApp(App)
//绑定事件总线
app.config.globalProperties.$bus = new mitt();
app.use(router)
app.use(store)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(VueLoaders)
app.mount('#app')
// 自定义指令-动态title
app.directive('title', {
    updated(el, binding) {
        document.title = binding.value
    }
})

