<template>
  <h1 class="text" @click="test">这是测试页1</h1>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {getSearchHot} from "@/api/record";


onMounted(() => {
  const date = new Date();
  console.log(dayjs(date).format('YYYY-MM-DD HH:mm:ss'))
  console.log(dayjs(date).format('YYYY-MM-DD'))
  const a = '2021-11-12'
  // dayjs().toNow() // in 2 years
  // dayjs().toNow(true) // 2 years
})
</script>

<style lang="scss">
.other-login {
  .el-divider {
    background-color: yellow !important;
  }
}
</style>
