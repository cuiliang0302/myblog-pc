<template>
  <h1>这是子组件</h1>
  {{ sendValue }}
</template>

<script setup>
const props = defineProps({
  // 父自己给子组件传的值
  sendValue: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<style scoped>

</style>