<template>
  <h1>aaaa</h1>
</template>

<script setup>
import {ElMessage, ElButton} from 'element-plus'
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';

onMounted(() => {
  console.log(import.meta.env.MODE)
})


</script>

<style scoped lang="scss">

</style>
