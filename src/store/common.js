import {defineStore} from 'pinia'

const useCommonStore = defineStore('Common', {
  state: () => ({
    aside_menu_fold: false,// 个人中心导航栏是否折叠
    drawer_visible: false, // 设置菜单默认关闭
    outline_list: [],// markdown目录(sessionStorage)
    outline_show: true,// markdown目录是否显示
    next_path: '/personal/myIndex', // 登录后跳转路径
    // asideMenuFold: false,
    // 当前激活的导航栏菜单id
    menu_index: '1',
  }),
  // 计算属性
  getters: {
    // 计算数据翻倍值
    // double() {
    //   return this.count * 2
    // },
  },
  // 修改数据
  actions: {
    // 修改侧边状态
    setAsideMenuFold(value) {
      console.log(value)
      this.aside_menu_fold = value
    },
    // 修改当前激活的页面导航栏id
    setMenuIndex(value) {
      console.log(value)
      this.menu_index = value
    },
    // 修改登录后跳转页面
    setNextPath(value){
      this.next_path = value
    },
    // 修改markdown目录内容
    setOutlineList(value) {
      this.outline_list = value
    }
  },
  // 开启数据持久化
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'common',
    // 修改为 sessionStorage，默认为 localStorage
    storage: localStorage,
  }
})

export default useCommonStore