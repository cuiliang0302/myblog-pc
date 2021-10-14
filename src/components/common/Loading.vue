<template>
  <div v-show="type='image'" class="image-loading">
    <vue-loaders-ball-spin-fade-loader name="ball-spin-fade-loader" color="#74b9ff"></vue-loaders-ball-spin-fade-loader>
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
})
</script>

<style scoped lang="scss">
.image-loading {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
