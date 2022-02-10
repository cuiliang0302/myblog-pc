const mutations = {
	// 设置markdown目录内容
	setOutline(state, value) {
		state.outline = value
	},
	// 设置markdown是否显示
	setOutlineShow(state) {
		state.outlineShow = !state.outlineShow
	},
	// 设置登录后跳转的地址
	setNextPath(state, path) {
		state.nextPath = path
	},
	// 是否保持登录
	setKeepLogin(state, value) {
		state.keepLogin = value
	},
	// 用户信息（保持登录）
	setUserLocal(state, value) {
		state.userLocal = value
	},
	// 用户信息（临时存储）
	setUserSession(state, value) {
		state.userSession = value
	},
	// 个人中心导航栏是否折叠
	setAsideMenuFold(state, value) {
		state.asideMenuFold = value
	},
	// 是否开启暗黑模式
	setDark(state, value) {
		state.dark = value
	},
	// 设置主题色
	setTheme(state, value) {
		state.theme = value
	},
	// 设置导航栏模式
	setNavigation(state, value) {
		state.navigation = value
	}
}
export default mutations
