<template>
  <el-button>默认按钮</el-button>
  <el-button type="primary">主要按钮</el-button>
<!--  <div className="infinite-list-wrapper" style="overflow:auto">-->
<!--    <ul-->
<!--        className="list"-->
<!--        v-infinite-scroll="load"-->
<!--        infinite-scroll-disabled="disabled">-->
<!--      <li v-for="i in count" className="list-item">{{ i }}</li>-->
<!--    </ul>-->
<!--    <p v-if="loading">加载中...</p>-->
<!--    <p v-if="noMore">没有更多了</p>-->
<!--  </div>-->
</template>

<script setup>
import {
  ElButton,
} from 'element-plus'
</script>

<style scoped lang="scss">

</style>
