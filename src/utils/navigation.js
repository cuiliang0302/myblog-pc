// 导航栏模式
import useStore from "@/store";
import {ref, onMounted, onUnmounted} from 'vue'
import {storeToRefs} from 'pinia'

const {theme, common} = useStore()
const {drawer_visible} = storeToRefs(common)

function navigation() {
  const isNavigationVisible = ref(false)
  const lastScrollY = ref(0)
  const isFirstScreen = ref(true)
  const SCROLL_THRESHOLD = 50 // 滚动灵敏度阈值（像素）

  // 设置-导航菜单样式选项
  const navigationList = [
    {value: 'auto', label: '自动'},
    {value: 'show', label: '固定显示'},
    {value: 'hide', label: '滚动隐藏'},
  ]
  // 设置显示模式
  const setNavigationMode = (newMode) => {
    theme.navigation_mode = newMode
    console.log("新的模式", newMode)
    handleScroll() // 立即更新状态
  }
  // 滚动处理逻辑
  const handleScroll = () => {
    const currentScrollY = window.scrollY || window.pageYOffset
    const scrollDirection = currentScrollY > lastScrollY.value ? 'down' : 'up'

    // 首屏检测（考虑移动端动态视口）
    isFirstScreen.value = currentScrollY < window.innerHeight * 0.2
    // console.log("currentScrollY", currentScrollY)
    // console.log("lastScrollY", lastScrollY.value)
    // console.log("lastScrollY", scrollDirection)
    // console.log("isFirstScreen", isFirstScreen.value)
    // 根据模式处理显示逻辑
    switch (theme.navigation_mode) {
      case 'auto':
        isNavigationVisible.value =
          scrollDirection === 'up' ||
          currentScrollY < SCROLL_THRESHOLD
        break
      case 'hide':
        drawer_visible.value = false
        isNavigationVisible.value = isFirstScreen.value
        break
      case 'show':
      default:
        isNavigationVisible.value = true
    }
    // 更新滚动位置缓存
    lastScrollY.value = currentScrollY
  }

  // 优化滚动监听
  let lastKnownPosition = 0
  let ticking = false
  const optimizedScrollHandler = () => {
    lastKnownPosition = window.scrollY
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll(lastKnownPosition)
        ticking = false
      })
      ticking = true
    }
  }
// 生命周期钩子
  onMounted(() => {
    window.addEventListener('scroll', optimizedScrollHandler)
    // 初始化位置检测
    handleScroll()
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', optimizedScrollHandler)
  })
  return {
    isNavigationVisible, setNavigationMode, navigationList
  }
}

export default navigation
