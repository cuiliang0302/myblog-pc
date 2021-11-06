<template>
  <div class="text">这是测试页1</div>
  <div class="other-login">
    <el-divider>
      <span>12345</span>
    </el-divider>
  </div>
</template>

<script>
export default {
  data() {
    return {
      color: 'red'
    }
  }
}
</script>

<style lang="scss">
.other-login {
  .el-divider {
    background-color: yellow!important;
  }
}
</style>
