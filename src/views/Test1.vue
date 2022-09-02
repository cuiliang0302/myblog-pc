<template>
  <h1>这是测试页1</h1>
  <el-skeleton style="width: 240px" :loading="loading" animated>
    <template #template>
      <el-skeleton-item variant="image" style="width: 240px; height: 240px"/>
    </template>
    <template #default>
      <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
        <img
            src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
            class="image"
        />
        <div style="padding: 14px">
          <span>Delicious hamburger</span>
          <div class="bottom card-header">
            <div class="time">{{ currentDate }}</div>
            <el-button text class="button">Operation button</el-button>
          </div>
        </div>
      </el-card>
    </template>
  </el-skeleton>
</template>

<script setup>
import {ref} from "vue";
const currentDate = ref("123")
const loading = ref(true)

</script>

<style scoped lang="scss">

</style>
