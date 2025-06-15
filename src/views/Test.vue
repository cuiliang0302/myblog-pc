<template>
  <div>
    <p>当前主题：{{ isDark ? '暗黑模式' : '亮色模式' }}</p>
    <el-button
        type="primary"
        @click="toggleTheme"
        :disabled="isAnimating"> <!-- 防止动画期间重复点击 -->
      {{ isAnimating ? '切换中...' : '切换主题' }}
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const isAnimating = ref(false) // 防止动画期间重复点击

const toggleTheme = (e) => {
  if (isAnimating.value) return

  // 获取点击位置（同时支持鼠标和触摸事件）
  const x = e.clientX || e.touches?.[0]?.clientX || window.innerWidth / 2
  const y = e.clientY || e.touches?.[0]?.clientY || window.innerHeight / 2

  // 计算扩散半径（覆盖最远角落）
  const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
  )

  // 动画定义
  const clipPath = [
    `circle(0px at ${x}px ${y}px)`,
    `circle(${radius}px at ${x}px ${y}px)`
  ]

  // 不支持 View Transitions API 的浏览器
  if (!document.startViewTransition) {
    toggleDark()
    return
  }

  isAnimating.value = true
  const isDarkBefore = isDark.value

  const transition = document.startViewTransition(() => {
    toggleDark()
  })

  transition.ready.then(() => {
    // 统一在新视图上执行动画
    document.documentElement.animate(
        {
          clipPath: isDarkBefore ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 600,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)'
        }
    )
  })

  // 动画结束后重置状态
  transition.finished.finally(() => {
    isAnimating.value = false
  })
}
</script>

<style>
/* 全局样式确保生效 */
::view-transition-new(root),
::view-transition-old(root) {
  animation: none;
  mix-blend-mode: normal; /* 修复颜色混合问题 */
}

/* 主题变量 */
:root {
  --bg-color: #ffffff;
  --text-color: #213547;
  background: var(--bg-color);
  color: var(--text-color);
  transition: background 0.3s ease; /* 平滑背景色过渡 */
}

:root.dark {
  --bg-color: #1a1a1a;
  --text-color: rgba(255, 255, 255, 0.87);
}

/* 添加页面过渡效果 */
::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}
</style>