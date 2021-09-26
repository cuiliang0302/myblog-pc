<template>
  <el-config-provider :locale="locale">
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </el-config-provider>

</template>

<script setup>
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
import {onMounted} from "vue";
import {
  ElMessageBox
} from 'element-plus'

const locale = zhCn
onMounted(() => {
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

<style>
</style>
