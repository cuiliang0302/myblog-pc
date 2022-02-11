// 导航栏模式
import {computed, onMounted, ref} from "vue";
import store from "@/store/index";

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
	const navigationType = ref('show')
	// 切换导航栏模式
	const setNavigation = (value) => {
		store.commit('setNavigation', value)
		console.log("执行切换导航栏样式事件：", navigationMode.value)
		if (value === 'auto') {
			console.log("当前是自动")
		}
		if (value === 'show') {
			console.log("当前是显示")
			navigationType.value = 'show'
		}
		if (value === 'hide') {
			console.log("当前是隐藏")
			navigationType.value = 'hide'
		}
	}
	//上次滚动位置
	const lastTop = ref(0)
	//防抖处理
	const debounce = (fn, wait) => {
		let timer = null
		return function () {
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(fn, wait)
		}
	}
	// 监听页面滚动处理
	const scrollHandle = () => {
		let newTop = document.body.scrollTop || document.documentElement.scrollTop
		if (navigationMode.value === 'auto') {
			if (lastTop.value < newTop) {
				console.log("向下滚动")
				navigationType.value = 'hide'
			} else {
				console.log("向上滚动")
				navigationType.value = 'show'
			}
			lastTop.value = newTop;
		}
		if (navigationMode.value === 'hide') {
			if (newTop < 100){
				navigationType.value = 'show'
			}else {
				navigationType.value = 'hide'
			}
		}
	}
	onMounted(() => {
		setNavigation(navigationMode.value)
		// 添加scroll监听
		window.addEventListener("scroll", debounce(scrollHandle, 500), false);
		navigationType.value = 'show'
	})
	return {
		setNavigation, navigationList, navigationType
	}
}

export default navigation
