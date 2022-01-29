<template>
  <h1>这是测试页</h1>
  <el-button size="medium" type="success">
    <label class="pointer" for="uploads">更换图片</label>
  </el-button>
  <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
         accept="image/png, image/jpeg, image/jpg" @change="btn($event)">
  <UploadImg ref="UploadImgRef" :width="150" :height="150" :dir="'logo'" @saveImg="saveImg"></UploadImg>
</template>

<script setup>
import {ref} from "vue";
import UploadImg from "@/components/common/UploadImg.vue"
// 图片上传成功事件
const saveImg = (url) => {
  console.log(url)
}

const UploadImgRef = ref(null)
const btn = ($event)=>{
  console.log("按钮点击了")
  UploadImgRef.value.uploadChange($event)
}
</script>

<style scoped lang="scss">

</style>
