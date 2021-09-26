import {createApp} from 'vue'
import App from './App.vue'
import router from '@/router';
import store from '@/store';
import '@/assets/style/index.scss'
import ElementPlus from '@/plugins/ElementPlus'
// import 'element-plus/theme-chalk/src/index.scss'
import 'element-plus/dist/index.css'
import animate from "animate.css";
import 'nprogress/nprogress.css'

const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.mount('#app')
// 自定义指令-动态title
app.directive('title', {
	updated(el, binding) {
		document.title = binding.value
	}
})
