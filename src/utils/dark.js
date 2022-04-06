// 暗黑模式
import {computed, onMounted, ref} from "vue";
import store from "@/store/index";
import color from "@/utils/color"
import {useCssVar} from "@vueuse/core";

function dark() {
	let {darkList, lightList} = color()
	// 当前是否开启暗黑模式
	const isDark = computed(() => store.state.dark)
	// 切换暗黑模式
	const setDark = (value) => {
		store.commit('setDark', value)
		// console.log("执行切换开启暗黑模式事件：", isDark.value)
		const el = ref(null)
		if (isDark.value) {
			// console.log("要切换为暗黑模式")
			// console.log(darkList.value)
			darkList.value.forEach((item, index) => {
				// console.log(item.name, item.value, index)
				index = useCssVar(item.name, el)
				index.value = item.value
			})
		} else {
			// console.log("要切换为明亮模式")
			// console.log(lightList.value)
			lightList.value.forEach((item, index) => {
				// console.log(item.name, item.value, index)
				index = useCssVar(item.name, el)
				index.value = item.value
			})
		}
	}
	onMounted(() => {
		// console.log("是否开启暗黑模式：",isDark)
		setDark(isDark.value)
	})
	return {
		setDark,
	}
}

export default dark
