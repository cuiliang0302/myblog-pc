import {defineStore} from 'pinia'
import {useCssVar, useDark, useToggle} from '@vueuse/core'
import {ref} from "vue";
// 主题换肤
const useThemeStore = defineStore('theme', {
  state: () => ({
    theme_name: '拂晓蓝(默认)',
    theme_color: '#409eff',
    is_dark: null,
    navigation_mode: 'show'
  }),
  // 计算属性
  getters: {},
  // 修改数据
  actions: {
    initializeTheme() {
      // 如果已经初始化则跳过
      if (this.is_dark == null) {
        // 检测浏览器主题偏好
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        console.log("是否是深色模式", prefersDark)
        this.is_dark = prefersDark
      }
      this.applyDark()
      this.applyTheme()
      // 监听系统主题变化（可选）
      // const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      // mediaQuery.addEventListener('change', (e) => {
      //   if (this.is_dark === null) { // 仅在没有用户设置时响应
      //     console.log(e.matches)
      //     this.is_dark = e.matches
      //     this.applyTheme()
      //   }
      // })
    },

    // 切换主题
    toggleTheme(name,color) {
      this.theme_name = name
      this.theme_color = color
      this.applyTheme()
    },
    // 切换深色模式
    applyDark() {
      const isDark = useDark()
      if (this.is_dark === true) {
        console.log('切换为深色模式')
        document.documentElement.setAttribute('class', 'dark')
      } else {
        console.log('切换为浅色模式')
        document.documentElement.setAttribute('class', 'light')
      }
      useToggle(isDark)
    },
    // 切换主题色
    applyTheme() {
      const el = ref(null)
      const primary_color = useCssVar('--el-color-primary', el)
      console.log(primary_color.value)
      primary_color.value = this.theme_color
    },
    // 切换导航栏模式
    // applyNavigation(value){
    //   this.navigation = 'value'
    // }
  },
  // 持久化存储插件其他配置
  persist: {
    // 修改存储中使用的键名称，默认为当前 Store的 id
    key: 'useThemeStore',
    // 修改为 sessionStorage，默认为 localStorage
    storage: localStorage,
  }
})

export default useThemeStore