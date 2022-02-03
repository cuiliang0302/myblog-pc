<template>
  <NavMenu></NavMenu>
  <h1 @click="setDarkMode">这是测试页</h1>
</template>
<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import {User, Tickets, Operation} from '@element-plus/icons-vue'
import dark from "@/utils/dark";
import {computed, ref} from "vue";
import store from "@/store";
const isDark = ref(false)
let {setDark} = dark()
const setDarkMode = ()=>{
  let isDark = computed(() => store.state.dark)
  console.log(isDark)
  setDark(!isDark)
}
</script>
<style lang="scss" scoped>
@import "src/assets/style/index.scss";
//在此使用了背景颜色变量
@include background_color("background_color1");
//再次使用了文字颜色变量
@include font_color("font_color1");
</style>
