<template>
  <el-container>
    <el-aside width="200px"><AsideMenu></AsideMenu></el-aside>
    <el-container>
      <el-header><NavMenu :kind="'back'"></NavMenu></el-header>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import AsideMenu from "@/components/personal/AsideMenu.vue";
</script>

<style scoped lang="scss">
.el-container {
  height: 100vh;

  .el-header {
    padding: 0;
  }
}

</style>
