<!--评论回复组件-->
<template>
  <ol class="comments" v-for="(item,index) in commentsList" :key="index">
    <li>
      <span><el-avatar :src="item.photo" :size="50"></el-avatar></span>
      <span>
        <div>
          <p>
            <span class="username">{{ item.username }}</span>
            <span class="time-ago">{{ timeAgo(item.time) }}</span>
          </p>
          <p class="content">{{ item.content }}</p>
          <p class="action">
            <span><MyIcon type="icon-like"/>赞 {{ item.like }}</span>
            <span><MyIcon type="icon-comment"/>回复</span>
            <span>
              <el-popconfirm
                  title="确定要删除吗？"
              >
                <template #reference>
                  <span><MyIcon type="icon-delete"/>删除</span>
                </template>
              </el-popconfirm>
            </span>
          </p>
        </div>
      </span>
    </li>
    <div class="reply" v-if="item.child.length!==0">
      <Comments :commentsList="item.child"></Comments>
    </div>
  </ol>
</template>

<script setup>
import {reactive, ref, getCurrentInstance} from "vue";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";

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
// let {userId, isLogin} = user();
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
const likeMessage = (messageId) => {
  likeList.value.push(messageId)
  $bus.emit("likeMessage", messageId);
}
// 判断评论留言能否删除
const isDelete = (messageUser) => {
  // if (!isLogin.value) {
  //   return false
  // }
  // if (messageUser !== userId.value) {
  //   return false
  // }
  return true
}
// 评论留言删除
const delMessage = (messageId) => {
  // Dialog.confirm({
  //   title: '删除确认',
  //   message: '当真要删除这条宝贵的记录吗？',
  // }).then(() => {
  //   $bus.emit("delMessage", messageId);
  // })
}
// 回复输入框默认状态
const textareaShow = ref(false)
// 回复输入框内容
const replyForm = reactive({
  content: '',
  user: '',
  father: ''
})
// 点击留言评论回复事件
const replyMessage = (father) => {
  textareaShow.value = true
  replyForm.father = father
  // replyForm.user = userId.value
}
// 发送评论留言回复事件
const replySend = () => {
  // if (replyForm.content === '') {
  //   Toast.fail("请输入内容！")
  //   return false
  // } else {
  //   $bus.emit("replySend", replyForm);
  //   // emit('replySend', replyForm)
  //   replyForm.content = ''
  //   textareaShow.value = false
  // }
}
// 判断是否可回复留言
const isReply = (user) => {
  // if (isLogin.value === true && userId.value !== user) {
  //   return true
  // } else {
  //   return false
  // }
  return true
}
</script>

<style lang="scss" scoped>

ol {
  margin: 20px 0 20px 20px;
  color: $color-text-regular;
  list-style: none;

  li {
    display: flex;

    span:nth-child(2) {
      flex: 1;

      div {
        position: relative;
        background-color: $color-background-base;
        border-radius: 10px;
        margin-left: 15px;
        border: 1px solid $color-border-base;
        padding: 15px;

        p {
          padding: 10px 0;
        }

        .username {
          margin-right: 40px;
          color: $color-secondary;
          cursor: pointer;
        }

        .content {
          color: $color-text-primary;
        }

        .action {
          > span {
            margin-right: 80px;
            cursor: pointer;
            font-size: 12px;

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
        border-right: 9px solid $color-border-base;
        top: 15px;
        left: -9px;
      }
    }
  }

  .reply {
    margin-left: 40px;
  }
}
</style>
