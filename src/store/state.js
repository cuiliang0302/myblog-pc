const state = {
	// markdown目录(sessionStorage)
	outline: {},
	// markdown目录是否显示
	outlineShow: true,
	// 登录后跳转页
	nextPath: '/',
	// 是否保持登录
	keepLogin: false,
	// 保持登录用户信息(localStorage)
	userLocal: {},
	// 临时登录用户信息(sessionStorage)
	userSession: {}
}
export default state

