const mutations = {
	// 设置markdown目录内容
	setOutline(state, value) {
		state.outline = value
	},
	// 设置markdown是否显示
	setOutlineShow(state) {
		state.outlineShow = !state.outlineShow
	}
}
export default mutations
