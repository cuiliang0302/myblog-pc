<template>
  <el-image
      style="width: 100px; height: 100px"
      :src="url"
      :preview-src-list="srcList"
      :initial-index="1"
  >
  </el-image>
</template>

<script setup>
import {ref} from "vue";

const url = ref(
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
)
const srcList = ref([
  'https://oss.cuiliangblog.cn/carousel/2021_01_26_19_37_43_316840.jpg',
  'https://oss.cuiliangblog.cn/carousel/carousel-1.png',
  'https://oss.cuiliangblog.cn/carousel/carousel-2.png'
])
</script>

<style scoped lang="scss">

</style>
