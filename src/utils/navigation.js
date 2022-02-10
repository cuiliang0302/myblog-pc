// 导航栏模式
import {computed, onMounted, ref} from "vue";
import store from "@/store/index";
import color from "@/utils/color"
import {useCssVar} from "@vueuse/core";

function navigation() {
	// 当前导航栏模式
	const navigationMode = computed(() => store.state.navigation)
	// 设置-导航菜单样式选项
	const navigationList = [
		{value: 'auto', label: '自动'},
		{value: 'show', label: '固定显示'},
		{value: 'hide', label: '滚动隐藏'},
	]
	// 导航栏样式
	const navigationClass = ref('')
	// 切换导航栏模式
	const setNavigation = (value) => {
		store.commit('setNavigation', value)
		console.log("执行切换导航栏样式事件：", navigationMode.value)
		if(value==='auto'){
			console.log("当前是自动")
		}
		if(value==='show'){
			console.log("当前是显示")
			navigationClass.value = 'navigation-show'
		}
		if(value==='hide'){
			console.log("当前是隐藏")
			navigationClass.value = ''
		}
	}
	onMounted(() => {
		setNavigation(navigationMode.value)
	})
	return {
		setNavigation,navigationList,navigationClass
	}
}

export default navigation
