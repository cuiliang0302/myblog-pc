<template>
  <el-config-provider :locale="locale">
    <div class="router-view">
      <router-view v-slot="{ Component }">
        <keep-alive :include="includeList">
          <component :is="Component"/>
        </keep-alive>
      </router-view>
    </div>
  </el-config-provider>
</template>

<script setup>
import {onMounted, ref, watch,provide,nextTick} from "vue";
import {ElMessageBox} from 'element-plus'
import dark from "@/utils/dark";
import {useRouter} from "vue-router";
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
let {setDark} = dark()
const locale = zhCn
const includeList = ref([])
const router = useRouter()
const isRouterActive = ref(true)
provide('reload', () => {
  isRouterActive.value = false
  nextTick(() => {
    isRouterActive.value = true
  })
})
watch(() => router, (newValue) => {
  console.log(newValue.currentRoute.value.meta)
  if (newValue.currentRoute.value.meta.keepAlive && includeList.value.indexOf(newValue.currentRoute.value.name) === -1) {
    includeList.value.push(newValue.currentRoute.value.name);
    console.log("缓存的view", includeList.value);
  }
}, {deep: true})
onMounted(() => {
  const is_dark = window.matchMedia('(prefers-color-scheme: dark)').matches
  console.log("app判断是否为dark:", is_dark)
  setDark(is_dark)
  if (document.body.clientWidth <= 1200) {
    ElMessageBox.alert('检测到您使用移动设备访问，点击确定后跳转至移动版网站', {
      confirmButtonText: '确定',
      showClose: false,
      center: true,
      callback: () => {
        location.href = "https://m.cuiliangblog.cn"
      },
    });
  }
  try {
    document.body.removeChild(document.getElementById('Loading'))
    setTimeout(function () {
      document.getElementById('app').style.display = 'block';
    }, 500)
  } catch (e) {
    console.log(e)
  }
})

</script>

<style lang="scss">

.router-view {
  color: var(--el-text-color-primary);
  background-color: var(--el-background-color-base);
  transition: background 1s, color 0.6s;
  width: 100%;
  height: max-content;
  min-height: 100vh;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: 0 auto;
  -webkit-overflow-scrolling: touch;
  animation-timing-function: linear;
}
</style>
