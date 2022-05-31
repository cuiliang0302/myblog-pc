<!--归档页-->
<template>
  <NavMenu></NavMenu>
  <div class="page">
    <div class="animate__animated animate__zoomIn">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item v-for="(item,index) in classifyList" :key="index"
                          :title="formatMonth(item.month)+' ('+item.count+'篇)'"
                          :name="index">
          <div class="timeline">
            <el-timeline>
              <el-timeline-item v-for="(item,index) in articleList" :key="index"
                                :timestamp="timeFull(item.created_time)"
                                placement="top">
                <div class="title">
                  <p class="article-title-hover" @click="router.push(`/detail/article/${item.id}`)">{{ item.title }}</p>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup name="Classify">
import {
  ElCollapse,
  ElCollapseItem,
  ElTimeline,
  ElTimelineItem,
  ElCard,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"

import {nextTick, onActivated, onMounted, ref} from "vue";
import {getClassify, getClassifyArticle} from "@/api/blog";
import timeFormat from "@/utils/timeFormat";
import {useRouter} from "vue-router";
import store from "@/store";

const router = useRouter()
// 文章日期完整显示
let {timeFull} = timeFormat()
// 格式化显示年月
const formatMonth = (value) => {
  return value.replace("-", "年") + '月'
}
// 默认展开的数据
const activeNames = ref([0]);
// 月份列表
const classifyList = ref([])

// 获取归档月份列表数据
async function classifyData() {
  classifyList.value = await getClassify()
}

// 指定月份文章列表
const articleList = ref([])

// 获取指定月份文章列表
async function classifyArticleData(month) {
  articleList.value = await getClassifyArticle(month)
  console.log(articleList.value)
}

// 切换月份事件
const handleChange = (val) => {
  console.log("切换了", val)
  if (val.length !== 0) {
    classifyArticleData(classifyList.value[val].month)
  }
};
onMounted(async () => {
  await classifyData()
  console.log(classifyList.value[0])
  await classifyArticleData(classifyList.value[0].month)
})
onActivated(() => {
  store.commit('setMenuIndex', '4')
})
</script>

<style lang="scss">

.el-collapse-item__header {
  font-size: 20px !important;
  color: var(--el-color-primary) !important;
  padding-left: 1em;
}

.timeline {
  margin: 10px 40px 0 40px;

  .title {
    background-color: var(--el-border-color);
    padding: 10px 15px;
    border-radius: 10px;
    margin-right: 30px;

    p {
      font-size: 18px;
    }
  }

  .title::after {
    border-bottom: 10px solid transparent;
    border-top: 10px solid transparent;
    border-left: 10px solid transparent;
    border-right: 10px solid var(--el-border-color);
    content: " ";
    position: absolute;
    top: 40px;
    left: 8px;
  }
}
</style>
