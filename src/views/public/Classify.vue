<!--归档页-->
<template>
  <NavMenu></NavMenu>
  <div class="page">
    <div class="animate__animated animate__zoomIn">
      <el-collapse v-model="activeNames" @change="handleChange" accordion>
        <el-collapse-item v-for="(data,month) in classifyList" :key="month"
                          :title="formatMonth(month)+' (文章'+data.article+'篇 笔记'+data.section+'篇)'"
                          :name="month">
          <div class="timeline">
            <el-timeline>
              <el-timeline-item v-for="(item,index) in articleList" :key="index"
                                :timestamp="timeFull(item.created_time)"
                                placement="top"
                                size="large"
                                :color="item.type==='section'?'#2ecc71':'#9b59b6'"
                                :icon="item.type==='section'?List:Checked">
                <div class="title">
                  <p class="article-title-hover" @click="toDetail(item)">{{ item.title }}</p>
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
import {List, Checked} from '@element-plus/icons-vue'
import {
  ElCollapse,
  ElCollapseItem,
  ElTimeline,
  ElTimelineItem,
  ElMessage,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"

import {onActivated, onMounted, reactive, ref} from "vue";
import {getClassify, getClassifyArticle} from "@/api/blog";
import timeFormat from "@/utils/timeFormat";
import {useRouter} from "vue-router";
import useStore from "@/store";
const {common} = useStore();

const router = useRouter()
// 文章日期完整显示
let {timeFull} = timeFormat()
// 格式化显示年月
const formatMonth = (value) => {
  return value.replace("-", "年") + '月'
}
// 默认展开的数据
const activeNames = ref([0]);
// 月份汇总列表
const classifyList = reactive({})

// 获取归档月份列表数据
function classifyData() {
  getClassify().then((response) => {
    console.log(response)
    Object.keys(response).forEach((key) => {
      classifyList[key] = response[key];
    });
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('获取归档数据失败！')
  });
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
  articleList.value = []
  if (val.length !== 0) {
    classifyArticleData(val)
  }
};
// 跳转文章或笔记
const toDetail = (value) => {
  console.log(value)
  if (value['type'] === 'article') {
    router.push('/detail/article/' + value['id'])
  } else {
    router.push('/detail/section/' + value['id'])
  }
}
onMounted(async () => {
  await classifyData()
})
onActivated(() => {
  common.setMenuIndex('4')
  //store.commit('setMenuIndex', '4')
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
