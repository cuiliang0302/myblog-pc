<template>
  <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
  >
    <el-menu-item index="1">Processing Center</el-menu-item>
    <el-menu-item index="3" disabled>Info</el-menu-item>
    <el-menu-item index="4">Orders</el-menu-item>
    <span class="center">
      <el-dropdown @visible-change="dropdownChange">
      <span class="el-dropdown-link">
        Dropdown List
        <el-icon v-if="isDropdown"><ArrowUpBold/></el-icon>
        <el-icon v-else><ArrowDownBold/></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>Action 1</el-dropdown-item>
          <el-dropdown-item>Action 2</el-dropdown-item>
          <el-dropdown-item>Action 3</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    </span>
  </el-menu>
</template>
<script setup name="Test">
import {ElMessage} from 'element-plus'
import {ArrowDownBold, ArrowUpBold} from '@element-plus/icons-vue'
import {ref} from "vue";
// 个人中心-是否下拉状态
const isDropdown = ref(false)
const activeIndex = ref('1')
const dropdownChange = () => {
  console.log("来了")
  isDropdown.value = !isDropdown.value
  console.log(isDropdown.value)
}
</script>
<style scoped lang="scss">
.center {
  display: flex;
  align-items: center;
}
</style>
