<template>
  <div class="text">这是测试页1</div>
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
.text {
  color: v-bind(color);
}
</style>
