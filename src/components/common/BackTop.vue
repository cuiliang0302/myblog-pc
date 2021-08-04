<template>
  <el-backtop :bottom="80">
    <MyIcon type="icon-backTop"/>
  </el-backtop>
</template>

<script setup>
import {
  ElBacktop,
} from 'element-plus'
import icon from "@/utils/icon";

let {MyIcon} = icon()
</script>

<style scoped lang="scss">
.el-backtop {
  opacity: 0.5;
  color: $color-text-regular;
  transition: all 0.5s;
}

.el-backtop:hover {
  opacity: 1;
  color: $color-primary;
}
</style>
