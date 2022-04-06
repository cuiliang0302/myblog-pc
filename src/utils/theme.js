// 暗黑模式
import {computed, onMounted, ref} from "vue";
import store from "@/store/index";
import {useCssVar} from "@vueuse/core";

function theme() {
	// 当前默认主题色
	const themeValue = computed(() => store.state.theme)
	// 切换主题色
	const setTheme = (value) => {
		store.commit('setTheme', value)
		// console.log("执行切换主题色事件：", themeValue.value)
		const el = ref(null)
		const primary_color = useCssVar('--el-color-primary', el)
		primary_color.value = themeValue.value
	}
	onMounted(() => {
		setTheme(themeValue.value)
	})
	return {
		setTheme,
	}
}

export default theme
