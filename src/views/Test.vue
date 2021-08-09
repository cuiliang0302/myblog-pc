<template>
  <div class="demo-image__preview">
    <h1 @click="showImg">点我</h1>
    <el-image-viewer v-if="images.isShow" :initial-index="images.currentIndex"
                     :url-list="images.MDimages" @close="images.isShow=false">
    </el-image-viewer>
  </div>
</template>

<script setup>
import {defineComponent, reactive, ref} from 'vue';
import {
  ElImageViewer,
} from 'element-plus'

const images = reactive({
  MDimages: [
    'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
    'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg',
  ],
  currentIndex: 1,
  isShow: false,
})
// markdown图片查看
const showImg = () => {
  images.isShow = true
  console.log(images)
}
</script>
<style>

</style>
