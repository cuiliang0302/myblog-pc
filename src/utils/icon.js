// 自定义图标
import {createFromIconfontCN} from "@ant-design/icons-vue";

function icon() {
	const MyIcon = createFromIconfontCN({
		scriptUrl: '//at.alicdn.com/t/font_2697113_u4u42etoorm.js', // 在 iconfont.cn 上生成
	});
	return {
		MyIcon
	}
}

export default icon
