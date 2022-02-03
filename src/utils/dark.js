// 暗黑模式
import {onMounted, reactive} from "vue";
import store from "@/store/index";

function dark() {
	let isDark = store.state.dark
	const setDark = (value) => {
		isDark = value
		store.commit('setDark', isDark)
		console.log("切换开启暗黑模式：",isDark)
		if (isDark) {
			window.document.documentElement.setAttribute("data-theme", 'dark');
		} else {
			window.document.documentElement.setAttribute("data-theme", 'light');
		}
	}
	onMounted(() => {
		console.log("是否开启暗黑模式：",isDark)
		if (isDark) {
			window.document.documentElement.setAttribute("data-theme", 'dark');
		} else {
			window.document.documentElement.setAttribute("data-theme", 'light');
		}
	})
	return {
		setDark,
	}
}

export default dark
