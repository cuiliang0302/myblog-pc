<template>
  <el-menu
      :default-active="activeIndex"
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
  是否开启深色模式
  <el-switch v-model="value1"/>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Card name</span>
        <el-button class="button" text>Operation button</el-button>
      </div>
    </template>
    <div v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</div>
  </el-card>
  当前是否开启深色模式{{ isDark }}
</template>
<script setup name="Test">
import {onMounted, ref, watch} from "vue";
import dark from "@/utils/dark";

const activeIndex = ref('1')
const value1 = ref(true)
let {isDark, setDark} = dark()
watch(() => value1.value, (newVal, oldVal) => {
  console.log(newVal, oldVal)
  setDark(newVal)
})
onMounted(() => {
  value1.value = isDark.value
  console.log(isDark.value)
})
</script>
<style lang="scss" scoped>
</style>