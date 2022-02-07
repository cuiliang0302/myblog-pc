<template>
  <el-card shadow="hover">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章" name="article">
        <el-empty description="暂无文章收藏记录" v-if="collectList.length===0"></el-empty>
        <div class="timeline" v-else>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in collectList" :key="index" :timestamp="timeFull(item.time)"
                              placement="top">
              <div class="title">
                <p class="article-title-hover" @click="$router.push(`/detail/article/${item.id}`)">{{ item.name }}</p>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane label="笔记" name="section">
        <el-empty description="暂无笔记收藏记录" v-if="collectList.length===0"></el-empty>
        <div class="timeline">
          <el-timeline>
            <el-timeline-item v-for="(item,index) in collectList" :key="index" :timestamp="timeFull(item.time)"
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

<script setup>
import timeFormat from "@/utils/timeFormat";
import {onMounted, ref} from "vue";
import {getArticleHistory, getSectionHistory} from "@/api/record";
import user from "@/utils/user";
let {timeFull} = timeFormat()
// 引入用户信息模块
let {userId} = user();
const activeName = ref('article')
const handleClick = (tab) => {
  console.log(tab.props.name)
  if (tab.props.name === 'article') {
    getArticleHistoryData()
  } else {
    getSectionHistoryData()
  }
}
const collectList = ref([])

// 获取文章浏览记录
async function getArticleHistoryData() {
  let collectHistory_data = await getArticleHistory(NaN, userId.value)
  console.log(collectHistory_data)
  let collect_data = []
  for (let index in collectHistory_data) {
    if (collectHistory_data[index]['is_collect'] === true) {
      collect_data.push(collectHistory_data[index])
    }
  }
  collectList.value = collect_data.map((item) => {
    return {
      id: item['article_id'],
      name: item['article'],
      time: item['time']
    }
  })
}

// 获取笔记浏览记录
async function getSectionHistoryData() {
  let collectHistory_data = await getSectionHistory(NaN, userId.value)
  console.log(collectHistory_data)
  let collect_data = []
  for (let index in collectHistory_data) {
    if (collectHistory_data[index]['is_collect'] === true) {
      collect_data.push(collectHistory_data[index])
    }
  }
  collectList.value = collect_data.map((item) => {
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
    background-color: var(--el-background-color-base);
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
    border-right: 10px solid var(--el-background-color-base);
    content: " ";
    position: absolute;
    top: 40px;
    left: 8px;
  }
}
</style>
