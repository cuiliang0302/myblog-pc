<template>
  <el-card shadow="hover">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章" name="article">
        <el-empty description="暂无文章浏览记录" v-if="historyList.length===0"></el-empty>
        <div class="timeline" v-else>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in historyList" :key="index" :timestamp="timeFull(item.time)"
                              placement="top">
              <div class="title">
                <p class="article-title-hover" @click="$router.push(`/detail/article/${item.id}`)">{{ item.name }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane label="笔记" name="section">
        <el-empty description="暂无笔记浏览记录" v-if="historyList.length===0"></el-empty>
        <div class="timeline" v-else>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in historyList" :key="index" :timestamp="timeFull(item.time)"
                              placement="top">
              <div class="title">
                <p class="article-title-hover" @click="$router.push(`/detail/section/${item.id}`)">{{ item.name }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup name="MyHistory">
import {onMounted, ref} from "vue";
import {getArticleHistory, getSectionHistory} from "@/api/record";
import timeFormat from "@/utils/timeFormat";
import useStore from "@/store";
const {user} = useStore();
const {timeFull} = timeFormat()
const activeName = ref('article')
const handleClick = (tab) => {
  console.log(tab.props.name)
  if (tab.props.name === 'article') {
    getArticleHistoryData()
  } else {
    getSectionHistoryData()
  }
}
// 文章浏览记录
const historyList = ref([])

// 获取文章浏览记录
async function getArticleHistoryData() {
  let articleHistory_data = await getArticleHistory(NaN, user.user_id)
  console.log(articleHistory_data)
  historyList.value = articleHistory_data.map((item) => {
    return {
      id: item['article_id'],
      name: item['article'],
      time: item['time']
    }
  })
}
// 获取笔记浏览记录
async function getSectionHistoryData() {
  let articleHistory_data = await getSectionHistory(NaN, user.user_id)
  console.log(articleHistory_data)
  historyList.value = articleHistory_data.map((item) => {
    return {
      id: item['section_id'],
      name: item['section'],
      time: item['time']
    }
  })
}
onMounted(() => {
  getArticleHistoryData()
})
</script>

<style scoped lang="scss">
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
