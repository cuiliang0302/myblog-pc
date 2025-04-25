<template>
  <el-card shadow="hover">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="文章" name="article">
        <el-empty description="暂无文章评论记录" v-if="commentList.length===0"></el-empty>
        <div class="timeline" v-else>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in commentList" :key="index" :timestamp="timeFull(item.time)"
                              placement="top">
              <div class="title">
                <p class="article-title-hover" @click="$router.push(`/detail/article/${item.id}`)">{{ item.name }}</p>
                <span class="comment-body">评论内容：</span>
                <span class="comment-tag"><el-tag><span v-html="item.content"></span></el-tag></span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
      <el-tab-pane label="笔记" name="section">
        <el-empty description="暂无笔记评论记录" v-if="commentList.length===0"></el-empty>
        <div class="timeline" v-else>
          <el-timeline>
            <el-timeline-item v-for="(item,index) in commentList" :key="index" :timestamp="timeFull(item.time)"
                              placement="top">
              <div class="title">
                <p class="article-title-hover" @click="$router.push(`/detail/section/${item.id}`)">{{ item.name }}</p>
                <span class="comment-body">评论内容：</span><el-tag type="success"><span class="content" v-html="item.content"></span></el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup name="MyComments">
import timeFormat from "@/utils/timeFormat";
import {onMounted, ref} from "vue";
import {getUserArticleComment, getUserSectionComment} from "@/api/record";
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
const commentList = ref([])

// 获取文章评论记录
async function getArticleHistoryData() {
  let articleComment_data = await getUserArticleComment()
  console.log(articleComment_data)
  commentList.value = articleComment_data.map((item) => {
    return {
      id: item['article_id'],
      name: item['article'],
      time: item['time'],
      content:item['content']
    }
  })
}

// 获取笔记评论记录
async function getSectionHistoryData() {
  let commentHistory_data = await getUserSectionComment()
  console.log(commentHistory_data)
  commentList.value = commentHistory_data.map((item) => {
    return {
      id: item['section_id'],
      name: item['section'],
      time: item['time'],
      content:item['content']
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
.comment-body{
  margin-top: 30px;
  display: inline-block;
}
.comment-tag{
  :deep(.el-tag__content){
    white-space: normal;
  }
  :deep(img){
    max-height: 70px!important;
  }
}
.content{
  :deep(img) {
    max-height: 150px;
  }
}

</style>
