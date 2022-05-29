<template>
  <el-menu
      class="el-menu-demo"
      mode="horizontal"
  >
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-sub-menu index="2">
      <template #title>Workspace</template>
      <el-menu-item index="2-1">item one</el-menu-item>
      <el-menu-item index="2-2">item two</el-menu-item>
      <el-menu-item index="2-3">item three</el-menu-item>
      <el-sub-menu index="2-4">
        <template #title>item four</template>
        <el-menu-item index="2-4-1">item one</el-menu-item>
        <el-menu-item index="2-4-2">item two</el-menu-item>
        <el-menu-item index="2-4-3">item three</el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
  </el-menu>
  <el-card>
    是否开启暗黑模式：
    <el-switch v-model="isDark" @change="setDarkMode"/>
    <br>
    主题色选择：
    <el-select v-model="color" placeholder="Select" size="large" @change="changeColor">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
  </el-card>
</template>

<script setup>
import { ref } from 'vue'
import dark from "@/utils/dark";
import { useCssVar } from '@vueuse/core'
let {setDark} = dark()
const activeIndex = ref('1')
// 设置-显示模式默认值
const isDark = ref(false)
// 设置-切换是否设置暗黑模式
const setDarkMode = (value)=>{
  console.log("切换暗黑模式事件")
  console.log(value)
  const el = ref(null)
  const bg_color = useCssVar('--el-color-white', el)
  const text_color = useCssVar('--el-text-color-primary', el)
  if (value){
    bg_color.value='#2b2b2b'
    text_color.value='#d0d0d0'
  }else {
    bg_color.value='#ffffff'
    text_color.value='#303133'
  }
}
const color = ref('')
const options = [
  {
    value: '#409EFF',
    label: '拂晓蓝(默认)',
  },
  {
    value: '#e74c3c',
    label: '薄暮红',
  },
  {
    value: '#e67e22',
    label: '火山橘',
  },
  {
    value: '#f1c40f',
    label: '日暮黄',
  },
  {
    value: '#16a085',
    label: '极光绿',
  },
  {
    value: '#9b59b6',
    label: '酱紫',
  },
]
const changeColor = (val)=>{
  console.log("切换主题色事件",val)
  const el = ref(null)
  const primary_color = useCssVar('--el-color-primary', el)
  primary_color.value = val
}
</script>

<style scoped lang="scss">
.el-card{
  margin-top:15px
}
</style>
