<template>
  <h1 class="text" @click="test">这是测试页1</h1>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {getSearchHot} from "@/api/record";
import Fuse from 'fuse.js'

const options = {
  includeScore: false
}
// 热门搜索列表
let hotList = ref([])

// 获取搜索热词
async function searchKeyHotData() {
  hotList.value = await getSearchHot()
}

const test = () => {
  console.log(hotList.value)
  let a = '1'
  const fuse = new Fuse(hotList.value, options)
  const result = fuse.search(a)
  console.log(result)
}
onMounted(() => {
  searchKeyHotData()
})
</script>

<style lang="scss">
.other-login {
  .el-divider {
    background-color: yellow !important;
  }
}
</style>
