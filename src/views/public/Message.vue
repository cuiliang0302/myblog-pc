<template>
  <NavMenu></NavMenu>
  <div class="page">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span class="card-title">📝 我要留言</span>
        </div>
      </template>
      <div class="input-field">
        <span v-if="isLogin===true"><el-avatar :size="50" :src="photo"></el-avatar></span>
        <span v-else><el-avatar :size="50" :src="logo"></el-avatar></span>
        <span><Editor ref="messageEditor"></Editor></span>
        <span v-if="isLogin===true"><el-button type="primary" round @click="sendMessage">留言</el-button></span>
        <span v-else><el-button type="primary" round @click="showLogin">登录</el-button></span>
      </div>
      <div class="comment-list">
        <Comments :commentsList="messageList.data"></Comments>
      </div>
      <p class="isLoading" v-if="loading" v-loading="loading"
         element-loading-text="玩命加载中"
         element-loading-background="#ffffff"></p>
      <p v-if="!noMore">
        <el-divider>我是有底线的</el-divider>
      </p>
    </el-card>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
  <LoginPopup ref="loginPopupRef"></LoginPopup>
</template>

<script setup name="Message">
import {ElMessage} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import Editor from "@/components/common/Editor.vue"
import Comments from "@/components/common/Comments.vue";
import LoginPopup from "@/components/common/LoginPopup.vue"
import {getCurrentInstance, onMounted, onUnmounted, reactive, ref, computed} from "vue";
import {
  deleteLeaveMessage,
  getLeaveMessage,
  postLeaveMessage,
  postReplyLeaveMessage,
  patchLeaveMessage, getLeaveMessageDetail
} from "@/api/record";
import icon from "@/utils/icon";
import user from "@/utils/user";
import {getSiteConfig} from "@/api/management";
import {getUserinfoId} from "@/api/account";
import store from "@/store";
import {useRouter} from "vue-router";

const router = useRouter()
// 事件总线
const internalInstance = getCurrentInstance();  //当前组件实例
const $bus = internalInstance.appContext.config.globalProperties.$bus;
// 页面刷新
import {inject} from 'vue';

const reload = inject("reload");
// 引入用户信息模块
let {userId, isLogin} = user();
let {MyIcon} = icon()
// 登录弹窗对象
const loginPopupRef = ref(null)
// logo
const logo = ref()
// 用户头像
const photo = ref()

// 获取网站logo
async function getLogoData() {
  let data = await getSiteConfig()
  logo.value = data.logo
  console.log("logo:", logo.value)
}

// 获取用户头像
async function getPhotoData() {
  let data = await getUserinfoId(userId.value)
  console.log(data)
  photo.value = data.photo
}

// 留言列表
const messageList = reactive({
  page: 1,
  count: 0,
  data: []
})
// 加载留言动画
const loading = ref(false);

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
  messageForm.content = messageEditor.value.content
  console.log(messageForm.content)
  if (messageForm.content) {
    messageForm.user = userId.value
    postLeaveMessage(messageForm).then((response) => {
      console.log(response)
      ElMessage({
        message: '留言成功！',
        type: 'success',
      })
      messageForm.content = ''
      messageEditor.value.clear()
      leaveMessageData()
      reload();
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      for (let i in response) {
        ElMessage.error(i + response[i][0])
      }
    });
  } else {
    ElMessage('请输入留言内容')
  }
}
// 弹出登录框
const showLogin = () => {
  store.commit('setNextPath', router.currentRoute.value.fullPath)
  loginPopupRef.value.showPopup()
}

// 获取留言列表
function leaveMessageData() {
  // console.log(loading.value)
  if (loading.value) return; // 防止重复加载
  loading.value = true;
  getLeaveMessage({'page': messageList.page}).then(response => {
    messageList.data.push(...response.results)
    console.log(messageList)
    messageList.count = response.count
    loading.value = false;
    messageList.page += 1//增加页数
  }).catch(error => {
    console.log(error)
    ElMessage.error("获取留言列表数据失败")
  })
}

// 刷新留言列表
function leaveMessageDataRefresh() {
  getLeaveMessage({'page': 1, 'size': 1000}).then(response => {
    messageList.data = []
    messageList.data.push(...response.results)
  }).catch(error => {
    console.log(error)
    ElMessage.error("获取留言列表数据失败")
  })
}

// 是否还有更多需要加载
const noMore = computed(() => messageList.data.length !== messageList.count);
// 处理页面滚动事件
const handleScroll = () => {
  const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10 && !loading.value && noMore.value) {
    leaveMessageData();
  }
};
// 留言查看回复事件
if (!$bus.all.get("replyView")) $bus.on("replyView", (value) => {
  getLeaveMessageDetail(value).then((response) => {
    console.log(response)
    console.log(messageList.data)
    // 查找 id 为 113 的对象并替换为新的对象
    let targetIndex = messageList.data.findIndex(item => item.id === value);
    if (targetIndex !== -1) {
      messageList.data[targetIndex] = Object.assign({}, response); // 使用 Object.assign() 替换整个对象
    }
    // replyList.value = response.child;
    console.log(messageList.data)
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error(response.msg)
  });
});
// 留言点赞事件
if (!$bus.all.get("likeMessage")) $bus.on("likeMessage", (value) => {
  const params = {'like': value.like}
  patchLeaveMessage(value.id, params).then((response) => {
    console.log(response)
    ElMessage({
      message: '点赞成功！',
      type: 'success',
    })
    leaveMessageDataRefresh()
    reload();
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error(response.msg)
  });
});
// 留言回复事件
if (!$bus.all.get("replySend")) $bus.on("replySend", replyForm => {
  console.log(replyForm)
  postReplyLeaveMessage(replyForm).then((response) => {
    console.log(response)
    ElMessage({
      message: '回复成功！',
      type: 'success',
    })
    leaveMessageDataRefresh()
    reload();
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    for (let i in response) {
      ElMessage.error(i + response[i][0])
    }
  });
});
// 留言删除事件
if (!$bus.all.get("delMessage")) $bus.on("delMessage", messageId => {
  console.log(messageId)
  deleteLeaveMessage(messageId).then((response) => {
    console.log(response)
    ElMessage({
      message: '留言删除成功！',
      type: 'success',
    })
    leaveMessageDataRefresh()
    reload();
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error(response.msg)
  });
});
onMounted(() => {
  store.commit('setMenuIndex', '5')
  leaveMessageData()
  // 监听滚动事件
  window.addEventListener("scroll", handleScroll);
  if (isLogin.value === true) {
    getPhotoData()
  } else {
    getLogoData()
  }
})
onUnmounted(() => {
  // 组件卸载时，停止监听
  window.removeEventListener("scroll", handleScroll, false)
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

.isLoading {
  padding: 30px;
  font-size: 30px;
}
</style>
