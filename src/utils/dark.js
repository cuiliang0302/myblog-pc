// 暗黑模式
import {useDark, useToggle} from '@vueuse/core'

function dark() {
	const isDark = useDark()
	// debugger
	console.log("当前dark状态是",isDark.value)
	const toggleDark = useToggle(isDark)
	const setDark = (value) => {
		console.log("开始设置是否启用深色模式", value)
		if (value !== isDark.value) {
			toggleDark()
		}
	}
	return {
		isDark, setDark
	}
}

export default dark