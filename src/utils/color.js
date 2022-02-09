// 颜色管理
import {ref} from "vue";

function color() {
	// 主题颜色变量组
	const themeList = ref([
		{name: '拂晓蓝(默认)', value: '#409eff'},
		{name: '薄暮红', value: '#e74c3c'},
		{name: '火山橘', value: '#e67e22'},
		{name: '日暮黄', value: '#f1c40f'},
		{name: '极光绿', value: '#16a085'},
		{name: '酱紫', value: '#9b59b6'},
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
		{name: '--el-text-color-regular', value: '#606266'},
		{name: '--el-color-primary-light-9', value: '#ecf5ff'},
		{name: '--el-border-color-base', value: '#dcdfe6'},
		{name: '--el-border-color-light', value: '#e4e7ed'},
		{name: '--el-border-color-extra-light', value: '#f2f6fc'},
		{name: '--el-border-color-lighter', value: '#ebeef5'},
		// 	--el-color-white: #ffffff;
		// --el-color-black: #000000;
		// --el-color-primary: hsl(210, 100%, 63%);
		// --el-color-primary-light-1: #53a8ff;
		// --el-color-primary-light-2: #66b1ff;
		// --el-color-primary-light-3: #79bbff;
		// --el-color-primary-light-4: #8cc5ff;
		// --el-color-primary-light-5: #a0cfff;
		// --el-color-primary-light-6: #b3d8ff;
		// --el-color-primary-light-7: #c6e2ff;
		// --el-color-primary-light-8: #d9ecff;
		// --el-color-primary-light-9: #ecf5ff;
		// --el-color-success: #67c23a;
		// --el-color-success-light: #e1f3d8;
		// --el-color-success-lighter: #f0f9eb;
		// --el-color-warning: #e6a23c;
		// --el-color-warning-light: #faecd8;
		// --el-color-warning-lighter: #fdf6ec;
		// --el-color-danger: #f56c6c;
		// --el-color-danger-light: #fde2e2;
		// --el-color-danger-lighter: #fef0f0;
		// --el-color-error: #f56c6c;
		// --el-color-error-light: #fde2e2;
		// --el-color-error-lighter: #fef0f0;
		// --el-color-info: #909399;
		// --el-color-info-light: #e9e9eb;
		// --el-color-info-lighter: #f4f4f5;
		// --el-text-color-primary: #303133;
		// --el-text-color-regular: #606266;
		// --el-text-color-secondary: #909399;
		// --el-text-color-placeholder: #c0c4cc;
		// --el-border-color-base: #dcdfe6;
		// --el-border-color-light: #e4e7ed;

		// --el-background-color-base: #f5f7fa;
	])
	// 暗黑模式全局颜色
	const darkList = ref([
		{name: '--el-background-color-base', value: '#000000'},
		{name: '--el-color-white', value: '#141414'},
		{name: '--el-text-color-primary', value: '#ffffff'},
		{name: '--el-text-color-regular', value: '#d0d0d0'},
		{name: '--el-color-primary-light-9', value: '#1f1f1f'},
		{name: '--el-border-color-base', value: '#434343'},
		{name: '--el-border-color-light', value: '#434343'},
		{name: '--el-border-color-extra-light', value: '#5c5c5c'},
		{name: '--el-border-color-lighter', value: '#434343'},
		// {name: '--el-border-base', value: '#434343'},
		// {name: '--el-color-white', value: '#383838'},

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
		tagColor, lightList, darkList, themeList
	}
}

export default color
