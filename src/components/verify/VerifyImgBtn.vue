<!--图片验证按钮-->
<template>
  <div class="main">
    <div>
      <el-popover
          :visible="show"
          placement="top-start"
          :width="275"
          trigger="manual"
      >
        <template #reference>
          <el-button v-if="!isPassing" class="verify-btn" @click="showPopup">
            <MyIcon type="icon-verify"/>
            <span class="btn-text">请点击按钮进行安全验证</span>
          </el-button>
          <el-button v-else class="verify-btn verify-success" @click="showPopup" disabled>
            <MyIcon type="icon-success"/>
            <span class="btn-text">验证成功</span>
          </el-button>
        </template>
        <div class="verify">
          <drag-verify-img-chip
              ref="dragVerify"
              :imgsrc="imgList[imgId]"
              :isPassing.sync="isPassing"
              :showRefresh="true"
              text="请按住滑块拖动"
              successText="验证通过"
              handlerIcon="el-icon-d-arrow-right"
              successIcon="el-icon-circle-check"
              @refresh="refresh"
              @passcallback="pass"
              @close="close"
          />
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script setup>
// 图片滑块组件(拼图)
import dragVerifyImgChip from "@/components/verify/dragVerifyImgChip.vue";
import {onMounted, ref} from "vue";
import icon from "@/utils/icon";
import {ElMessage} from 'element-plus'

let {MyIcon} = icon()
const props = defineProps({
  // 是否通过验证
  isPassing: {
    type: Boolean,
    default: false
  },
})
const emit = defineEmits(['verifyPass'])
// 滑块验证对象
const dragVerify = ref(null)
// 验证弹窗状态
const show = ref(false)
const imgList = ref([
  'src/assets/verify/verify-1.jpg',
  'src/assets/verify/verify-2.jpg',
  'src/assets/verify/verify-3.jpg',
  'src/assets/verify/verify-4.jpg',
  'src/assets/verify/verify-5.jpg',
  'src/assets/verify/verify-6.jpg'])
const imgId = ref()
const getImgId = () => {
  imgId.value = parseInt(Math.random() * imgList.value.length, 10);
}
// 刷新图片
const refresh = () => {
  console.log('刷新图片')
  getImgId()
}
// 关闭验证
const close = () => {
  console.log("关闭验证")
  show.value = false
}
const pass = () => {
  console.log("过了")
  emit('verifyPass')
  ElMessage({
    message: '滑块验证成功！',
    type: 'success',
  })
  setTimeout(() => {
    show.value = false
    dragVerify.value.reset()
    refresh()
  }, 1000);
}
const showPopup = () => {
  show.value = true;
};
onMounted(() => {
  refresh()
})
</script>

<style lang="scss">
@import "src/assets/style/index";

.verify-btn {
  width: 100%;
  color: $color-text-placeholder;

  .btn-text {
    margin-left: 10px;
  }
}

.verify-success {
  color: $color-other-turquoise!important;
}
</style>
