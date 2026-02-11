<template>
  <div
      :class="'outline  animate__animated animate__'+ (outline_show===true?'fadeInRight':'fadeOutRight')">
    <div v-if="outline_list.length !== 0">
      <p class="pointer" v-for="(anchor,index) in outline_list" :key="anchor.lineIndex"
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

import {ref, watch} from "vue";
import {
  ElTooltip,
  ElEmpty,
} from 'element-plus'
import useStore from "@/store";
import {storeToRefs} from 'pinia'
const {common} = useStore();
const props = defineProps({
  // markdown屏幕滚动距离
  scrollTop: {
    type: Number,
    required: true,
    default: 0
  },
})
// 文章标题列表
const {outline_list} = storeToRefs(common)
// const titleList = computed(() => store.state.outline)
// 大纲是否显示
const {outline_show} = storeToRefs(common)
// const outlineShow = computed(() => store.state.outlineShow)
// markdown-当前高亮的标题
const heightTitle = ref(0)

// 定义事件(子组件向父组件传参)
const emit = defineEmits(['rollTo']);

// markdown-标题跳转
const rollTo = (anchor, index) => {
  emit('rollTo', anchor)
  heightTitle.value = index
}
// 监听页面滚动：高亮「已进入视口」的最后一个标题（与文档顶对齐，height 与 scrollTop 同坐标系）
watch(
    () => props.scrollTop,
    (value) => {
      if (!outline_list.value?.length) return
      const offset = 80 // 标题接近视口顶部时的切换阈值
      let lastIndex = -1
      for (let i = 0; i < outline_list.value.length; i++) {
        if (outline_list.value[i].height <= value + offset) lastIndex = i
      }
      heightTitle.value = lastIndex >= 0 ? lastIndex : 0
    }
)
</script>

<style scoped lang="scss">
.outline {
  position: fixed;
  font-size: 13px;
  line-height: 25px;
  color: var(--el-text-color-secondary);
  margin-left: 10px;
  height: 82vh;
  overflow: auto;
  min-width: 200px;

  p {
    margin-left: 5px;
    transition: all 0.5s;
  }

  p:hover {
    color: var(--el-color-primary);
  }

  .title-active {
    color: var(--el-text-color-primary);
    border-left: 2px solid var(--el-color-primary);
    background-color: var(--el-bg-color);
  }
}
</style>
