<!--评论回复组件-->
<template>
  <ol class="comments" v-for="(item,index) in commentsList" :key="index">
    <li>
      <span><el-avatar :src="item.photo" :size="50"></el-avatar></span>
      <span>
        <div>
          <p>
            <span v-if="item.username==='admin'" class="admin">博主</span>
            <span v-else class="username">{{ item.username }}</span>
            <span class="time-ago">{{ timeAgo(item.time) }}</span>
          </p>
          <p class="content" v-html=item.content></p>
          <p class="action">
            <span>
              <span v-if="isLike(item.id)===true" class="no-choose">
                <MyIcon class="icon" type="icon-like-solid"/>赞 {{ item.like }}
              </span>
              <span v-else @click="likeMessage(item.id,item.like)">
                <MyIcon class="icon" type="icon-like"/>赞 {{ item.like }}
              </span>
            </span>
            <span>
              <span v-if="isReply(item.user)===true" @click="replyMessage(item.id)">
                <MyIcon type="icon-comment"/>回复
              </span>
              <span v-else class="no-choose"><MyIcon type="icon-comment"/>回复</span>
            </span>
            <span>
              <span v-if="isDelete(item.user)===true">
                <el-popconfirm
                    title="确定要删除吗？"
                    @confirm="delMessage(item.id)"
                >
                <template #reference>
                  <span><MyIcon type="icon-delete"/>删除</span>
                </template>
                </el-popconfirm>
              </span>
              <span v-else class="no-choose"><MyIcon type="icon-delete"/>删除</span></span>
          </p>
        </div>
      </span>
    </li>
    <div class="reply" v-if="item.child.length!==0">
      <Comments :commentsList="item.child"></Comments>
    </div>
  </ol>
  <el-dialog
      v-model="textareaShow"
      title="回复留言"
      width="50%"
  >
    <Editor ref="replyEditor"></Editor>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="textareaShow = false">取消</el-button>
        <el-button type="primary" @click="replySend">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {reactive, ref, getCurrentInstance} from "vue";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";
import user from "@/utils/user";
import {ElMessage} from "element-plus";

let {MyIcon} = icon()
const props = defineProps({
  // 评论回复列表
  commentsList: {
    type: Array,
    required: true,
    default: []
  },
})
const emit = defineEmits(['likeMessage', 'delMessage', 'replySend'])
// 事件总线
const internalInstance = getCurrentInstance();
const $bus = internalInstance.appContext.config.globalProperties.$bus;
// 引入用户信息模块
let {userId, isLogin} = user();
// 时间显示几天前
let {timeAgo} = timeFormat()
// 已点赞列表
const likeList = ref([])
// 判断是否已点赞
const isLike = (messageId) => {
  for (let i = 0; i < likeList.value.length; i++) {
    if (messageId === parseInt(likeList.value[i])) {
      return true;
    }
  }
  return false;
}
// 留言评论点赞
const likeMessage = (messageId, likeMessage) => {
  console.log("留言点赞了啊")
  likeList.value.push(messageId)
  const value = {
    'id': messageId,
    'like': likeMessage + 1
  }
  $bus.emit("likeMessage", value);
}
// 回复输入框默认状态
const textareaShow = ref(false)
// 回复编辑器对象
const replyEditor = ref(null)
// 回复输入框内容
const replyForm = reactive({
  content: '',
  user: '',
  father: ''
})
// 点击留言评论回复事件
const replyMessage = (father) => {
  console.log(father)
  textareaShow.value = true
  replyForm.father = father
  replyForm.user = userId.value
}
// 发送评论留言回复事件
const replySend = () => {
  replyEditor.value.syncHTML()
  replyForm.content = replyEditor.value.content
  console.log(replyForm.content)
  if (replyForm.content === '') {
    ElMessage("请输入内容！")
    return false
  } else {
    $bus.emit("replySend", replyForm);
    replyEditor.value.clear()
    replyForm.content = ''
    textareaShow.value = false
  }
}
// 判断是否可回复留言
const isReply = (userID) => {
  if (isLogin.value === true && userId.value !== userID) {
    return true
  } else {
    return false
  }
}
// 判断评论留言能否删除
const isDelete = (userID) => {
  if (isLogin.value === false || userID !== userId.value) {
    return false
  } else {
    return true
  }
}
// 评论留言删除
const delMessage = (messageId) => {
  console.log(messageId)
  $bus.emit("delMessage", messageId);
}
</script>

<style lang="scss" scoped>
.no-choose:hover {
  cursor: not-allowed;
}

ol {
  margin: 20px 0 20px 20px;
  color: var(--el-text-color-regular);
  list-style: none;

  li {
    display: flex;

    span:nth-child(2) {
      flex: 1;

      div {
        position: relative;
        background-color: var(--el-border-color-extra-light);
        border-radius: 10px;
        margin-left: 15px;
        border: 1px solid var(--el-border-color);
        padding: 15px;

        p {
          padding: 10px 0;
        }

        .username {
          margin-right: 40px;
          color: var(--el-color-primary);
          cursor: pointer;
        }

        .admin {
          color: var(--el-color-primary); /*设置文字颜色*/
          font-weight: bolder; /*设置字体粗细*/
          -webkit-animation: flicker 2s infinite; /*设置动画*/
          margin-right: 30px;
        }

        @-webkit-keyframes flicker { /*创建admin呼吸效果动画*/
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }

        .content {
          color: var(--el-text-color-primary);
          line-height: 30px;

          :deep(img) {
            max-height: 150px;
          }
        }

        .action {
          > span {
            margin-right: 80px;
            cursor: pointer;
            font-size: 12px;
            color: var(--el-text-color-secondary);

            .anticon {
              margin-right: 10px;

              span {
                font-size: 10px;
              }
            }
          }
        }
      }

      div::before {
        position: absolute;
        content: '';
        display: inline-block;
        border-top: 9px solid transparent;
        border-bottom: 9px solid transparent;
        border-right: 9px solid var(--el-border-color-extra-light);
        top: 15px;
        left: -9px;
      }
    }
  }

  .reply {
    margin-left: 40px;

    span > div {
      background-color: var(--el-border-color) !important;
    }

    span > div::before {
      border-right: 9px solid var(--el-border-color) !important;
    }
  }
}
</style>
