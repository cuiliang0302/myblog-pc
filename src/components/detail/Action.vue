<template>

  <div class="action">
    <el-tooltip class="item" effect="dark" content="大纲" placement="left">
      <div @click="setOutline" :class="[outlineShow===true?'action-active':'']+' detail-action-hover'">
        <MyIcon type="icon-outline"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="点赞" placement="left">
      <div class="detail-action-hover">
        <MyIcon type="icon-like"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="收藏" placement="left">
      <div class="detail-action-hover">
        <MyIcon type="icon-collect"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="评论" placement="left">
      <div class="detail-action-hover">
        <MyIcon type="icon-comment"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="打赏" placement="left">
      <div class="detail-action-hover">
        <MyIcon type="icon-exceptional"/>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup>
import {
  ElTooltip,
} from 'element-plus'
import icon from "@/utils/icon";
import {computed, onMounted, ref} from "vue";
import store from "@/store";

let {MyIcon} = icon()
// 大纲是否显示
const outlineShow = computed(() => store.state.outlineShow)
// 设置大纲是否显示
const setOutline = () => {
  store.commit('setOutlineShow')
}
</script>

<style scoped lang="scss">


.action {
  position: fixed;
  bottom: 120px;
  width: 40px;
  height: 240px;
  right: 40px;

  > div {
    width: 40px;
    height: 40px;
    background-color: $color-background-white;
    border-radius: 20px;
    box-shadow: 0 0 6px rgb(0 0 0 / 12%);
    cursor: pointer;
    margin-bottom: 10px;
    opacity: 0.7;

    .anticon {
      transform: translate(50%, 50%);
      color: $color-text-regular;
      transition: all 0.5s;
      font-size: 20px
    }
  }

  .action-active {
    background-color: $color-other-sun-flower;
  }
}
</style>
