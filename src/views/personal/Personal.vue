<template>
  <el-container>
    <el-aside :width="aside_menu_fold===true?'65px':'200px'"><AsideMenu></AsideMenu></el-aside>
    <el-container>
      <el-header><NavMenu :kind="'back'"></NavMenu></el-header>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script setup name="Personal">
import NavMenu from "@/components/common/NavMenu.vue";
import AsideMenu from "@/components/personal/AsideMenu.vue";
import useStore from "@/store";
import {storeToRefs} from 'pinia'
const {common} = useStore();
// 个人中心导航栏是否折叠
const {aside_menu_fold} = storeToRefs(common)
</script>

<style scoped lang="scss">
.el-container {
  height: 100vh;

  .el-header {
    padding: 0;
  }
}

</style>
