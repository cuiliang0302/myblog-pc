// 暗黑模式
import {useDark, useToggle} from '@vueuse/core'
import store from "@/store";
import {computed, onMounted} from "vue";

function dark() {
    const isDark = computed(() => store.state.isDark)
    const use_dark = useDark()
    console.log("当前dark状态是", use_dark.value)
    console.log("当前vuex存放的是", isDark.value)
    const toggleDark = useToggle(use_dark)
    const setDark = (value) => {
        console.log("开始设置是否启用深色模式", value)
        if (value !== use_dark.value) {
            console.log("开始切换深色模式")
            toggleDark()
            store.commit('setDark', value)
        }
    }
    return {
        setDark, isDark
    }
}

export default dark