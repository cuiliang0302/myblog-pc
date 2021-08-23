<template>
  <div
      :class="'outline  animate__animated animate__'+ (outlineShow===true?'fadeInRight':'fadeOutRight')">
    <div v-if="titleList.length !== 0">
      <p v-for="(anchor,index) in titleList" :key="anchor.lineIndex"
         :style="{ padding: `0px 0 0px ${anchor.indent * 15}px` }"
         @click="rollTo(anchor,index)" :class="index===heightTitle?'title-active':''"
      >
        {{ anchor.title }}
      </p>
    </div>
    <div v-else>
      <el-empty description="该文章暂无大纲"></el-empty>
    </div>
  </div>
</template>

<script setup>

import {computed, onMounted, ref, watch} from "vue";
import store from "@/store";
import {
  ElTooltip,
  ElEmpty,
} from 'element-plus'

const props = defineProps({
  // markdown屏幕滚动距离
  scrollTop: {
    type: Number,
    required: true,
    default: 0
  },
})
// 文章标题列表
const titleList = computed(() => store.state.outline)
// 大纲是否显示
const outlineShow = computed(() => store.state.outlineShow)
// markdown-当前高亮的标题
const heightTitle = ref(0)

// 定义事件(子组件向父组件传参)
const emit = defineEmit(['rollTo']);

// markdown-标题跳转
const rollTo = (anchor, index) => {
  emit('rollTo', anchor)
  heightTitle.value = index
}
// 监听页面滚动
watch(
    () => props.scrollTop,
    (value) => {
      if (titleList.value) {
        const absList = [] // 各个h标签与当前距离绝对值
        titleList.value.forEach((item) => {
          absList.push(Math.abs(item.height - value))
        })
        // 屏幕滚动距离与标题具体最近的index高亮
        heightTitle.value = absList.indexOf(Math.min.apply(null, absList))
        // console.log("距离最近的标题index", heightTitle.value)
      }
    }
)
</script>

<style scoped lang="scss">
.outline {
  position: fixed;
  font-size: 13px;
  line-height: 25px;
  color: $color-text-secondary;
  margin-left: 10px;
  height: 82vh;
  overflow: auto;

  p {
    cursor: pointer;
    margin-left: 5px;
    transition: all 0.5s;
  }

  p:hover {
    color: $color-primary;
  }

  .title-active {
    background-color: $color-background-input;
    color: $color-text-primary;
    border-left: 2px solid $color-primary;
  }
}
</style>
