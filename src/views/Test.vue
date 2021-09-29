<template>
  <div class="exceptional">
    <h3>觉得文章还不错？打赏一下</h3>
    <div>
          <span>
          <el-image
              style="width: 200px; height: 200px"
              src="https://oss.cuiliangblog.cn/image/ali-pay.png"
              fit="fill">
          </el-image>
            <br>
          <p>支付宝</p>
        </span>
      <span>
          <el-image
              style="width: 200px; height: 200px"
              src="https://oss.cuiliangblog.cn/image/ali-pay.png"
              fit="fill">
          </el-image>
        <br>
          <p>微信</p>
        </span>
    </div>
  </div>
</template>

<script setup>
import {
  ElTooltip,
  ElPopover,
  ElImage,
} from 'element-plus'
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';

onMounted(() => {
  console.log(import.meta.env.MODE)
})


</script>

<style scoped lang="scss">
//打赏弹窗样式
.exceptional {
  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin: 0 10px;
    }

    p {
      margin-top: 10px;
      text-align: center;
    }
  }

  h3 {
    text-align: center;
    margin: 10px 0;
  }
}
</style>
