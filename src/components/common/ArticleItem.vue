<template>
  <section class="article-item article-item-hover">
    <span class="cover">
      <el-image :src="article.cover"
                style="width: 270px; height: 180px"
                :fit="'fill'"
                lazy>
        <template #placeholder>
          <Loading></Loading>
        </template>
      </el-image>
    </span>
    <span class="describe no-choose">
      <h2 class="article-title-hover">{{ article.title }}</h2>
      <p class="article-abstract-hover">{{ article.abstract }}</p>
      <div class="info">
        <span class="tag article-tag-hover"
              :style="'background-color: '+tagColor(article.category_id)">{{ article.category }}</span>
        <span><MyIcon type="icon-time"/>{{ timeAgo(article.created_time) }}</span>
        <span><MyIcon type="icon-view"/>{{ article.view }}</span>
        <span><MyIcon type="icon-like"/>{{ article.like }}</span>
        <span><MyIcon type="icon-collect"/>{{ article.collect }}</span>
        <span><MyIcon type="icon-comment"/>{{ article.comment }}</span>
      </div>
    </span>
  </section>
  <el-divider></el-divider>
</template>

<script setup>
import {
  ElImage,
  ElDivider,
} from 'element-plus'
import Loading from "@/components/common/Loading.vue"
import icon from "@/utils/icon";
import timeFormat from "@/utils/timeFormat";
import setColor from "@/utils/setColor";

const props = defineProps({
  // 参数校验与默认值
  article: {
    type: Object,
    required: true,
  },
})
let {MyIcon} = icon()
let {timeAgo} = timeFormat()
let {tagColor} = setColor()
</script>

<style scoped lang="scss">
.article-item {
  display: flex;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;

  .cover {
    width: 270px;
    padding: 3px;
    display: inline-block;
    border: 1px solid $color-border-base;
    border-radius: 8px;
  }

  .describe {
    margin-left: 10px;

    h2 {
      color: $color-text-primary;
      margin: 0;
    }

    p {
      color: $color-text-secondary;
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
      color: $color-text-placeholder;

      .tag {
        background-color: skyblue;
        border-radius: 5px;
        color: white;
        font-size: 10px;
        padding: 5px;
      }

      span {
        margin: 0 5px 0 20px;
      }
    }
  }
}

.el-divider--horizontal {
  margin: 5px 0 !important;
}
</style>
