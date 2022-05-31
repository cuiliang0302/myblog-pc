const state = {
    // markdown目录(sessionStorage)
    outline: {},
    // markdown目录是否显示
    outlineShow: true,
    // 登录后跳转页
    nextPath: '/personal/myIndex',
    // 是否保持登录
    keepLogin: false,
    // 保持登录用户信息(localStorage)
    userLocal: {},
    // 临时登录用户信息(sessionStorage)
    userSession: {},
    // 个人中心导航栏是否折叠
    asideMenuFold: false,
    // 是否开启暗黑模式
    dark: false,
    // 默认主题色
    theme: '#409eff',
    // 导航栏样式
    navigation: 'auto',
    // 当前激活的导航栏菜单id
    menuIndex: '',
}
export default state

