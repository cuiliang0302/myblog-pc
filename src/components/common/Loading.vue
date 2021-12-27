<template>
  <div v-show="props.type==='image'" class="image-loading">
    <vue-loaders-ball-spin-fade-loader name="ball-spin-fade-loader" color="#74b9ff"></vue-loaders-ball-spin-fade-loader>
  </div>
  <div v-show="props.type==='tips'" class="tips-loading">
    <vue-loaders-pacman color="#74b9ff"/>
    <p>{{ text }}</p>
  </div>
</template>
<script setup>
const props = defineProps({
  // 动画类型
  type: {
    type: String,
    required: false,
    default: 'image',
  },
  // 提示文字
  text: {
    type: String,
    required: false,
    default: '',
  }
})
</script>

<style scoped lang="scss">
.image-loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tips-loading {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  p{
    color: $color-text-primary;
  }
}
</style>
