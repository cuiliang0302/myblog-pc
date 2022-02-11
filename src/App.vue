<template>
  <el-config-provider :locale="locale">
    <div class="router-view">
      <router-view v-slot="{ Component }">
        <component :is="Component"/>
      </router-view>
    </div>
  </el-config-provider>
</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {onMounted} from "vue";
import {ElMessageBox} from 'element-plus'
import dark from "@/utils/dark";
let {setDark} = dark()
const locale = zhCn
onMounted(() => {
  const now = new Date()
  // setDark(false)
  if (now.getHours() >= 21 || now.getHours() <= 6) {
    console.log("这是夜间模式")
    setDark(true)
  } else {
    console.log("这是白天模式")
    setDark(false)
  }
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
