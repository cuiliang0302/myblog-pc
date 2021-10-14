<template>
  <NavMenu :activeMenu="'5'"></NavMenu>
  <div class="page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">📝 我要留言</span>
        </div>
      </template>
      <div class="input-field">
        <span><el-avatar :size="50"
                         src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar></span>
        <span><Editor ref="messageEditor"></Editor></span>
        <span><el-button type="primary" round @click="sendMessage">发表留言</el-button></span>
      </div>
      <div class="comment-list">
        <Comments :comments-list="messageList"></Comments>
      </div>
    </el-card>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup>
import {
  ElCard,
  ElTabs,
  ElTabPane,
  ElAvatar,
  ElPopconfirm,
  ElButton,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import Editor from "@/components/common/Editor.vue"
import Comments from "@/components/common/Comments.vue";
import {onMounted, reactive, ref} from "vue";
import {getLeaveMessage} from "@/api/record";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";

let {MyIcon} = icon()
// 时间显示几天前
let {timeAgo} = timeFormat()
// 留言列表
const messageList = ref([])
// 留言表单
const messageForm = reactive({
  content: '',
  user: '',
})
// 留言编辑器对象
const messageEditor = ref(null)
// 发送留言事件
const sendMessage = () => {
  messageEditor.value.syncHTML()
  console.log(messageEditor.value.content)
}

// 获取留言列表
async function leaveMessageData() {
  messageList.value = await getLeaveMessage()
}

onMounted(() => {
  leaveMessageData()
})
</script>

<style lang="scss" scoped>
.input-field {
  display: flex;
  justify-content: center;

  > span:nth-child(1) {
    width: 10%;
    padding-top: 10px;
    text-align: center;
  }

  > span:nth-child(2) {
    width: 80%;
  }

  > span:nth-child(3) {
    width: 10%;
    padding-top: 85px;
    text-align: center;
  }

  .editor {
    margin: 10px 0 30px 0 !important;
  }
}

.comment-list {
  margin-right: 25px;
}
</style>
