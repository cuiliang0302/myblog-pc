<template>
  <NavMenu></NavMenu>
  <h1>这是测试页</h1>
  {{isDark}}
  <el-button>Default</el-button>
  <el-button type="primary">Primary</el-button>
</template>
<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import {computed, onMounted} from "vue";
import store from "@/store";
const isDark = computed(() => store.state.dark)
onMounted(()=>{
  console.log("这是test页的",isDark)
})
</script>
<style lang="scss" scoped>
@import "src/assets/style/index.scss";
</style>
