<template>
  <div class="main">
    <BackTop></BackTop>
  </div>

</template>

<script setup>
import BackTop from "@/components/common/BackTop.vue"
import icon from "@/utils/icon";

let {MyIcon} = icon()
</script>

<style scoped lang="scss">
.main {
  height: 3000px;
  background-color: skyblue;
}
</style>
