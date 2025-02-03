import useUserStore from '@/store/user'
import useThemeStore from "@/store/theme";
import useCommonStore from '@/store/common'

// 统一导出useStore方法
export default function useStore() {
  return {
    user: useUserStore(),
    theme: useThemeStore(),
    common: useCommonStore(),
  }
}