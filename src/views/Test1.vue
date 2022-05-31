<template>
  <h1>这是父组件</h1>
  <el-input v-model="input" placeholder="父组件输入内容"/>
  <el-button @click="send">开始给子组件传值</el-button>
  <TestComponents :sendValue="sendValue"></TestComponents>
</template>

<script setup>
import {ref} from "vue";
import TestComponents from "@/components/TestComponents.vue";

const input = ref('')
const sendValue = ref('')
const send = () => {
  console.log("父组件传值给子组件")
  sendValue.value = input.value
}
</script>

<style scoped lang="scss">

</style>
