<template>
  {{user.token}}
  <br>
  {{user.username}}
  <br>
  {{user.user_id}}
  <br>
  {{user.keep_login}}
  <br>
  检查是否登录{{user.isLoggedIn}}
</template>

<script setup>
import {onMounted} from "vue"
import useStore from "@/store";
const {user} = useStore();
// 应用启动时初始化
onMounted(() => {

})
</script>

<style scoped>
</style>
