// 主题切换
import {onMounted, reactive} from "vue";
import store from "@/store/index";

function theme() {

// 存储菜单主题配置
	const setMenuTheme = (data) => {
		localStorage.setItem('menuTheme', JSON.stringify(data));
	}

// 获得菜单主题配置
	const getMenuTheme = () => {
		let result = localStorage.getItem('menuTheme');
		// 不为null时返回
		return result ? JSON.parse(result) : {};
	}

// 存储主题配置
	const setTheme = (data) => {
		localStorage.setItem('Theme', JSON.stringify(data));
	}

// 获得主题配置
	const getTheme = () => {
		let result = localStorage.getItem('Theme');
		// 不为null时返回
		return result ? JSON.parse(result) : {};
	}
	return {
		setMenuTheme, getMenuTheme, setTheme, getTheme
	}
}

export default theme
