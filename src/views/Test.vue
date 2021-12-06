<template>
  <h1 class="text" @click="test">这是测试页1</h1>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";


onMounted(() => {
  const date = new Date();
  console.log(date)
  debugger
})
</script>

<style lang="scss">
.other-login {
  .el-divider {
    background-color: yellow !important;
  }
}
</style>
