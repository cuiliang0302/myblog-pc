// 颜色管理
import {ref} from "vue";

function color() {
	// 主题颜色变量组
	const themeList = ref([
		{name: 'blue', value: '#409eff'},
		{name: 'red', value: '#e74c3c'},
		{name: 'orange', value: '#e67e22'},
		{name: 'yellow', value: '#f1c40f'},
		{name: 'green', value: '#16a085'},
		{name: 'purple', value: '#9b59b6'},
	])
	// 标签颜色变量组
	const tagList = ref([
		"#1abc9c",
		"#16a085",
		"#2ecc71",
		"#27ae60",
		"#3498db",
		"#2980b9",
		"#9b59b6",
		"#8e44ad",
		"#f1c40f",
		"#f39c12",
		"#e67e22",
		"#d35400",
		"#e74c3c",
		"#c0392b",
	])
	// 设置标签颜色
	const tagColor = (id) => {
		if (id > tagList.value.length) {
			// id 超过颜色组
			return tagList.value[id % 10]
		} else {
			return tagList.value[id + 1]
		}
	}
	// 明亮模式全局颜色
	const lightList = ref([
		{name: '--el-background-color-base', value: '#f5f7fa'},
		{name: '--el-color-white', value: '#ffffff'},
		{name: '--el-text-color-primary', value: '#303133'},
		{name: '--el-color-primary-light-9', value: '#ecf5ff'},
	])
	// 暗黑模式全局颜色
	const darkList = ref([
		{name: '--el-background-color-base', value: '#000000'},
		{name: '--el-color-white', value: '#141414'},
		{name: '--el-text-color-primary', value: '#ffffff'},
		{name: '--el-color-primary-light-9', value: '#1f1f1f'},
		// {name: '--el-border-base', value: '#434343'},
		// {name: '--el-color-white', value: '#383838'},
		// {name: '--el-border-color-base', value: '#434343'},
		// {name: '--el-border-color-light', value: '#434343'},
		// {name: '--el-border-color-lighter', value: '#434343'},
		// {name: '--el-border-color-hover', value: '#6d6d6d'},
		// {name: '--el-text-color-placeholder', value: '#5c5c5c'},
		// {name: '--el-text-color-regular', value: '#d0d0d0'},
		// {name: '--el-disabled-border-base', value: '#434343'},
		// {name: '--el-disabled-fill-base', value: '#383838'},
		// {name: '--el-disabled-border-color', value: '#434343'},
		// {name: '--el-disabled-bg-color', value: '#2b2b2b'},
		// {name: '--el-disabled-text-color', value: '#5c5c5c'},
		// {name: '--el-bg-color', value: '#3f3f3f'},
		// {name: '--el-bg-color-base', value: '#3f3f3f'},
		// {name: '--el-datepicker-inner-border-color', value: '#434343'},
		// {name: '--el-datepicker-inrange-background-color', value: '#383838'},
		// {name: '--el-datepicker-inrange-hover-background-color', value: '#434343'},
		// {name: '--el-dropdown-menuItem-hover-fill', value: '#434343'},
		// {name: '--el-dropdown-menuItem-hover-color', value: '#fff'},
		// {name: '--el-datepicker-border-color', value: '#434343'},
		// {name: '--el-svg-monochrome-grey', value: '#434343'},
		// {name: '--el-button-disabled-font-color', value: '#5c5c5c'}
	])
	return {
		tagColor, lightList, darkList
	}
}

export default color
