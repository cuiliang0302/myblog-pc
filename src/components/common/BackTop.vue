<template>
  <el-backtop :bottom="70">
    <el-tooltip class="item" effect="dark" content="回到顶部" placement="left">
      <div>
        <MyIcon type="icon-backTop"/>
      </div>
    </el-tooltip>

  </el-backtop>
</template>

<script setup>
import {
  ElBacktop,
  ElTooltip,
} from 'element-plus'
import icon from "@/utils/icon";

let {MyIcon} = icon()
</script>

<style scoped lang="scss">
.el-backtop {
  color: var(--el-text-color-regular);
  transition: all 0.5s;
}

.el-backtop:hover {
  opacity: 1;
  color: var(--el-color-primary);
}
</style>
