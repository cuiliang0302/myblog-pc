<!--笔记列表项-->
<template>
  <section class="section-item section-item-hover">
    <span class="describe no-choose">
      <h2 class="article-title-hover pointer" @click="toDetail(section.id)">{{ section.title }}</h2>
      <p class="article-abstract-hover pointer" @click="toDetail(section.id)">{{ section.abstract }}</p>
      <div class="info">
        <span class="tag section-tag-hover"
              :style="'background-color: '+tagColor(section.note_id)">{{ section.note }}</span>
        <span><MyIcon type="icon-time"/>{{ timeAgo(section.created_time) }}</span>
        <span><MyIcon type="icon-view"/>{{ section.view }}</span>
        <span><MyIcon type="icon-like"/>{{ section.like }}</span>
        <span><MyIcon type="icon-collect"/>{{ section.collect }}</span>
        <span><MyIcon type="icon-comment"/>{{ section.comment }}</span>
      </div>
    </span>
  </section>
  <el-divider></el-divider>
</template>

<script setup>
import icon from "@/utils/icon";
import timeFormat from "@/utils/timeFormat";
import color from "@/utils/color";
import {useRouter} from "vue-router";
import {onMounted, reactive} from "vue";

const router = useRouter()
const props = defineProps({
  // 参数校验与默认值
  section: {
    type: Object,
    required: true,
  },
})
let {MyIcon} = icon()
let {timeAgo} = timeFormat()
let {tagColor} = color()
// 跳转文章详情页
const toDetail = (detailID) => {
  router.push({path: `/detail/section/${detailID}`})
}
// 生成文章摘要
onMounted(() => {
  props.section['abstract'] = props.section['body']
      .replace('>', "")
      .replace('[TOC]', "")
      .replace(/#/g, " ") // 过滤标题#
      .replace(/\!\[[\s\S]*?\]\([\s\S]*?\)/, "") // 过滤图片
      .slice(0, 500)
})
</script>

<style scoped lang="scss">
.section-item {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;

  .describe {
    margin-left: 10px;

    h2 {
      color: var(--el-text-color-primary);
      margin: 0;
    }

    p {
      margin: 15px 0;
      color: var(--el-text-color-secondary);
      line-height: 28px;
      height: 108px;
      overflow: hidden;
      -webkit-line-clamp: 4;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }

    .info {
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--el-text-color-placeholder);

      span {
        margin: 0 5px 0 15px;
      }
    }
  }
}

.el-divider--horizontal {
  margin: 5px 0 !important;
}
</style>
