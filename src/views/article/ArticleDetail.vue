<template>
  <div v-title="articleData.title+'-'+siteName">
    <section class="detail">
      <!--    万维广告位-->
      <div class="wwads-cn wwads-vertical wwads-sticky advertising" data-id="259"></div>
      <NavMenu></NavMenu>
      <div class="detail-page">
        <div class="detail-left animate__animated animate__fadeInLeft">
          <!--        这是左边部分-->

        </div>
        <div class="detail-center">
          <div class="current-position">
            <span>您的位置：</span>
            <span>
            <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a @click="toCategory(articleData.category_id)">
              {{ articleData.category }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>文章正文</el-breadcrumb-item>
          </el-breadcrumb>
          </span>
          </div>
          <div class="main detail-card">
            <div v-if="JSON.stringify(articleData) === '{}'">
              <el-skeleton :rows="20" animated/>
            </div>
            <div v-else>
              <h1>{{ articleData.title }}</h1>
              <div class="info">
                <span><MyIcon type="icon-category"/>{{ articleData.category }}</span>
                <span><MyIcon type="icon-tag"/>
                  <span v-for="(tag,index) in articleData.tags" :key="index">{{ tag.name }}</span>
                </span>
                <span><MyIcon type="icon-time"/>{{ timeFull(articleData.created_time) }}</span>
                <span><MyIcon type="icon-view"/>{{ articleData.view }}</span>
                <span><MyIcon type="icon-like"/>{{ articleData.like }}</span>
                <span><MyIcon type="icon-collect"/>{{ articleData.collect }}</span>
                <span><MyIcon type="icon-comment"/>{{ articleData.comment }}</span>
              </div>
              <MarkDown :text="articleData.body"></MarkDown>
            </div>
            <div class="context">
            <span :class="context.last?'detail-context-hover':''" @click="toDetail(context.last.id)">
              <p><MyIcon type="icon-last"/></p>
              <p v-if="context.last">{{ context.last.title }}</p>
              <p v-else>已是第一篇</p>
            </span>
              <span>
              <p>文章分类：
                <span class="tag article-tag-hover" :style="'background-color: '+tagColor(articleData.category_id)">
                  {{ articleData.category }}
                </span>
              </p>
              <p>文章标签：
                <span v-for="item in articleData.tags" class="tag article-tag-hover"
                      :style="'background-color: '+tagColor(item.id)">
                  {{ item.name }}
                </span>
              </p>
            </span>
              <span :class="context.next?'detail-context-hover':''" @click="toDetail(context.next.id)">
              <p><MyIcon type="icon-next"/></p>
              <p v-if="context.next">{{ context.next.title }}</p>
              <p v-else>已是最后一篇</p>
            </span>
            </div>
          </div>
          <div class="guess detail-card">
            <h2>💖 猜你喜欢</h2>
            <div>
            <span class="recommend-hover" v-for="item in recommendList" @click="toDetail(item.id)">
              <el-image :src="item.cover"
                        style="width: 90%"
                        :fit="'fill'"
                        lazy>
                <template #placeholder>
                  <Loading></Loading>
                </template>
              </el-image>
              <p>{{ item.title }}</p>
          </span>
            </div>
          </div>
          <div class="comments detail-card" id="comment">
            <h2>📝 评论交流</h2>
            <div class="input-field">
              <span v-if="user.isLoggedIn===true"><el-avatar :size="50" :src="photo"></el-avatar></span>
              <span v-else><el-avatar :size="50" :src="logo"></el-avatar></span>
              <span><Editor ref="messageEditor"></Editor></span>
              <span v-if="user.isLoggedIn===true"><el-button type="primary" round
                                                             @click="clickSend">评论</el-button></span>
              <span v-else><el-button type="primary" round @click="showLogin">登录</el-button></span>
            </div>
            <div class="comment-list">
              <div class="comment-list">
                <Comments :comments-list="commentsList" @like-message="handleLikeMessage" @reply-send="handleReplySend" @del-message="handleDelMessage"></Comments>
              </div>
            </div>
          </div>
        </div>
        <div class="detail-right animate__animated animate__fadeIn">
          <Outline @rollTo="rollTo" :scrollTop="scrollTop"></Outline>
          <Action :detailType="'article'" @likeClick="likeClick" :isCollect="isCollect"
                  @collectClick="collectClick"></Action>
          <BackTop></BackTop>
        </div>
      </div>
      <Footer></Footer>
      <LoginPopup ref="loginPopupRef"></LoginPopup>
    </section>
  </div>
</template>

<script setup name="ArticleDetail">
import NavMenu from "@/components/common/NavMenu.vue";
import Loading from "@/components/common/Loading.vue"
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import MarkDown from "@/components/detail/MarkDown.vue"
import Action from "@/components/detail/Action.vue"
import Outline from "@/components/detail/Outline.vue"
import Editor from "@/components/common/Editor.vue"
import Comments from "@/components/common/Comments.vue"
import {ElLoading, ElMessage} from 'element-plus'
import {getArticleDetail, getContextArticle, getGuessLike, postLike} from "@/api/blog";
import {onMounted, reactive, ref, onBeforeUnmount, nextTick} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getImgProxy} from "@/api/public";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";
import color from "@/utils/color";
import {getSiteConfig} from "@/api/management";
import {
  deleteArticleComment,
  getArticleComment,
  getArticleHistory,
  postArticleComment, postArticleHistory,
  postReplyArticleComment,
  patchArticleComment, putArticleHistory
} from "@/api/record";
import {getUserinfo} from "@/api/account";
import {inject} from 'vue';
import useStore from "@/store";

const {user, common} = useStore();
const router = useRouter()
const reload = inject("reload");
let {MyIcon} = icon()
let {timeFull} = timeFormat()
let {tagColor} = color()
// 引入公共模块
let {articleID, siteName, toDetail, toCategory} = publicFn()
// 引入文章内容模块
let {articleData, context, recommendList, getArticleData, getContextData, getGuessLikeData} = article()
// 引入markdown模块
let {rollTo, scrollTop, scroll} = markdown()
// 评论编辑器对象
const messageEditor = ref(null)
// 弹窗登录对象
const loginPopupRef = ref(null)
// 调用评论回复点赞模块
let {
  commentsList,
  getArticleCommentData,
  logo,
  photo,
  showLogin,
  clickSend,
  handleLikeMessage,
  handleReplySend,
  handleDelMessage
} = comment(articleID, getArticleData, loginPopupRef, messageEditor)
// 调用动作菜单模块
let {likeClick, isCollect, getArticleHistoryData, collectClick, postArticleHistoryData} = action(articleID, articleData)
onMounted(async () => {
  // 开启加载中动画
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中……',
    background: 'rgba(255, 255, 255, 0.3)',
  })
  window.scrollTo({top: 0})
  common.setOutlineList('')
  articleID.value = router.currentRoute.value.params.id
  await getArticleData(articleID.value)
  loading.close()
  await getContextData(articleID.value)
  await getGuessLikeData(articleID.value)
  await postArticleHistoryData(articleID.value)
  window.addEventListener('scroll', scroll, {passive: true})
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll)
})
onBeforeRouteUpdate(async (to) => {
  // 开启加载中动画
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中……',
    background: 'rgba(255, 255, 255,0.3)',
  })
  window.scrollTo({top: 0})
  console.log(to)
  common.setOutlineList('')
  for (let key in context) {
    delete context[key];
  }
  await getArticleData(to.params.id)
  loading.close()
  await getContextData(to.params.id)
  await getGuessLikeData(to.params.id)
  await getArticleCommentData(to.params.id)
  await getArticleHistoryData()
  await postArticleHistoryData(to.params.id)
});

// 公共模块
function publicFn() {
  // 当前文章id
  const articleID = ref()
  // 站点名称
  const siteName = ref('')
  //跳转文章列表
  const toCategory = (categoryId) => {
    router.push({path: `/category/${categoryId}`})
  }

  // 获取站点名称
  async function siteConfigData() {
    let siteConfig_data = await getSiteConfig()
    siteName.value = siteConfig_data.name
  }

  // 点击跳转其他文章事件
  const toDetail = (detailID) => {
    articleID.value = detailID
    router.push({path: `/detail/article/${articleID.value}`})
  }
  onMounted(() => {
    siteConfigData()
  })
  return {articleID, siteName, toDetail, toCategory}
}

// 文章模块
function article() {
  // 当前文章分类id
  const activeMenu = ref()
  // 文章详情数据
  const articleData = reactive({})
  // 文章上下篇
  const context = reactive({})
  // 猜你喜欢
  const recommendList = ref([])

  // 获取文章详情
  async function getArticleData(DetailID) {
    const detail_data = await getArticleDetail(DetailID)
    for (let i in detail_data) {
      if (i === 'body') {
        // 图片防盗链处理
        articleData.body = detail_data.body
        const pattern = /!\[(.*?)\]\((https:\/\/cdn.nlark.com.*?)\)/gm;
        let matcher;
        let imgArr = [];
        while ((matcher = pattern.exec(articleData.body)) !== null) {
          imgArr.push(matcher[2]);
        }
        for (let i = 0; i < imgArr.length; i++) {
          articleData.body = articleData.body.replace(
              imgArr[i],
              getImgProxy(imgArr[i])
          );
        }
      } else {
        articleData[i] = detail_data[i]
      }
    }
    activeMenu.value = "2-" + articleData.category_id
    common.setMenuIndex(activeMenu.value)
  }

  // 获取文章上下篇
  async function getContextData(DetailID) {
    Object.assign(context, await getContextArticle(DetailID));
    console.log("context", context)
  }

  // 获取猜你喜欢
  async function getGuessLikeData(DetailID) {
    recommendList.value = await getGuessLike(DetailID)
    console.log("recommendList", recommendList.value)
  }

  return {articleData, context, recommendList, getArticleData, getContextData, getGuessLikeData}
}

// markdown模块
function markdown() {
  // 点击大纲跳转事件
  const rollTo = (anchor) => {
    const {lineIndex} = anchor;
    const heading = document.querySelector(
        `.v-md-editor-preview [data-v-md-line="${lineIndex}"]`
    );
    if (heading) {
      heading.scrollIntoView({behavior: "smooth", block: "start"})
    }
  }
  // markdown-页面滚动高度
  const scrollTop = ref(0)
  let scrollFrame = null
  const scroll = () => {
    if (scrollFrame !== null) return
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = null
      scrollTop.value = window.scrollY
    })
  }
  onBeforeUnmount(() => {
    if (scrollFrame !== null) cancelAnimationFrame(scrollFrame)
  })
  return {rollTo, scrollTop, scroll}
}

// 评论回复模块
function comment(articleID) {
  // logo
  const logo = ref()
  // 用户头像
  const photo = ref()
  // 评论列表
  const commentsList = ref([])

  // 获取网站logo
  async function getLogoData() {
    let data = await getSiteConfig()
    logo.value = data.logo
    console.log("logo:", logo.value)
  }

  // 获取用户头像
  const getPhotoData = async () => {
    try {
      let data = await getUserinfo()
      console.log(data)
      photo.value = data[0].photo
    } catch (err) {
      ElMessage.error('获取用户头像失败')
    }
  }


  // 获取文章评论数据
  async function getArticleCommentData() {
    await nextTick()
    commentsList.value = await getArticleComment(articleID.value)
    console.log("commentsList", commentsList.value)
  }

  // 评论表单
  const messageForm = reactive({
    content: '',
    user: '',
  })
  // 弹出登录框
  const showLogin = () => {
    common.setNextPath(router.currentRoute.value.fullPath)
    loginPopupRef.value.showPopup()
  }
  // 点击发表评论事件
  const clickSend = () => {
    messageEditor.value.syncHTML()
    messageForm.content = messageEditor.value.content
    console.log(messageForm.content)
    if (messageForm.content) {
      messageForm.user = user.user_id
      messageForm['article_id'] = articleID.value
      console.log(messageForm)
      postArticleComment(messageForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '评论成功！',
          type: 'success',
        })
        messageForm.content = ''
        messageEditor.value.clear()
        getArticleCommentData()
        reload();
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        for (let i in response) {
          ElMessage.error(i + response[i][0])
        }
      });
    } else {
      ElMessage('请输入评论内容')
    }
  }
  // 评论点赞事件
  const handleLikeMessage = value => {
    const params = {'like': value.like}
    patchArticleComment(value.id, params).then((response) => {
      console.log(response)
      ElMessage({
        message: '点赞成功',
        type: 'success',
      })
      // getArticleCommentData()
      reload();
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  }
  // 评论回复事件
  const handleReplySend = replyForm => {
    replyForm['article_id'] = articleID.value
    console.log(replyForm)
    postReplyArticleComment(replyForm).then((response) => {
      console.log(response)
      ElMessage({
        message: '回复成功！',
        type: 'success',
      })
      getArticleCommentData()
      reload();
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      for (let i in response) {
        ElMessage.error(i + response[i][0])
      }
    });
  }
  // 评论删除事件
  const handleDelMessage = messageId => {
    deleteArticleComment(messageId).then((response) => {
      console.log(response)
      console.log("要开始删除了")
      ElMessage({
        message: '评论删除成功！',
        type: 'success',
      })
      getArticleCommentData()
      reload();
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  }
  onMounted(() => {
    getArticleCommentData()
    if (user.isLoggedIn === true) {
      getPhotoData()
    } else {
      getLogoData()
    }
  })
  return {
    commentsList, logo, photo, messageForm, showLogin, clickSend, handleLikeMessage, handleReplySend, handleDelMessage
  }
}

// 侧边栏动作模块
function action(articleID, articleData) {
  // 文章点赞事件
  const likeClick = () => {
    const params = {id: articleID.value, 'kind': 'article'}
    articleData.like = articleData.like + 1
    postLike(params).then((response) => {
      console.log(response)
      ElMessage({
        message: '文章点赞成功！',
        type: 'success',
      })

    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  }
  // 文章收藏状态
  const isCollect = ref(false)

  // 获取文章浏览记录（是否已收藏）
  async function getArticleHistoryData() {
    await nextTick()
    if (user.isLoggedIn === true) {
      let res = await getArticleHistory(articleID.value)
      console.log("查询是否已收藏", res.is_collect)
      isCollect.value = res.is_collect
      console.log(isCollect.value)
    }
  }

  // 添加/取消收藏表单
  const CollectForm = reactive({
    user: '',
    is_collect: ''
  })
  // 子组件添加/取消收藏事件
  const collectClick = () => {
    if (user.isLoggedIn === true) {
      console.log("当前收藏状态是", isCollect.value)
      isCollect.value = !isCollect.value
      CollectForm.user = user.user_id
      CollectForm.is_collect = isCollect.value
      CollectForm['article_id'] = articleID
      putArticleHistory(CollectForm).then((response) => {
        console.log(response)
        if (response.is_collect === true) {
          ElMessage({
            message: '已添加收藏！',
            type: 'success',
          })
        } else {
          ElMessage({
            message: '已取消收藏！',
            type: 'success',
          })
        }
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage.error(response.msg)
      });
    } else {
      console.log("先登录")
      common.setNextPath(router.currentRoute.value.fullPath)
      loginPopupRef.value.showPopup()
    }
  }
  // 添加文章浏览记录表单
  const articleHistoryForm = reactive({
    article_id: '',
    user: ''
  })

  // 添加文章浏览记录
  async function postArticleHistoryData(article_id) {
    if (user.isLoggedIn === true) {
      articleHistoryForm.article_id = article_id
      articleHistoryForm.user = user.user_id
      console.log("添加文章浏览记录了")
      console.log("articleHistoryForm", articleHistoryForm)
      let res = await postArticleHistory(articleHistoryForm)
      console.log(res)
    }
  }

  onMounted(() => {
    getArticleHistoryData()
  })
  return {
    likeClick, isCollect, getArticleHistoryData, collectClick, postArticleHistoryData
  }
}
</script>

<style scoped lang="scss">
.detail {
  .detail-page {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;

    .detail-left {
      width: 15vw;
    }

    .detail-center {
      width: 70%;

      .main {
        padding:10px 0;
        h1 {
          text-align: center;
          margin: 20px 0;
        }

        .info {
          display: flex;
          justify-content: center;
          align-items: center;
          color: var(--el-text-color-regular);
          background-color: var(--el-border-color);
          padding: 5px 0px;
          margin: 10px 30px;
          border-radius: 20px;

          > span {
            margin: 0 2%;

            .anticon {
              margin-right: 10px;
            }
          }

          span:nth-child(2) {
            span:nth-child(2) {
              margin-right: 10px;
            }
          }
        }

        .context {
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-text-color-regular);
          background-color: var(--el-border-color);
          margin: 10px 30px;
          padding: 10px 10px;
          border-radius: 10px;

          span {
            flex: 1;
            text-align: center;

            .anticon {
              color: var(--el-color-primary);
              margin: 0 10px;
              font-size: 25px;
            }

            p {
              margin: 15px 0;
            }
          }

          > span:nth-child(2) {
            border-left: 2px solid var(--el-text-color-placeholder);
            border-right: 2px solid var(--el-text-color-placeholder);

            span {
              margin: 0 5px
            }
          }
        }
      }

      .guess {
        padding:10px;
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px;

          &:hover {
            span {
              opacity: 0.3;
            }
          }

          span {
            text-align: center;
            flex: 1;

            &:hover {
              opacity: 1;
            }

            p {
              font-size: 14px;
              color: var(--el-text-color-secondary);
              margin: 10px 0px;
            }
          }
        }
      }

      .comments {
        margin-bottom: 15px;
        padding: 10px;
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
          padding: 0px 15px 0px 5px;
        }
      }

      h2 {
        border-bottom: 1px solid var(--el-border-color);
        padding: 10px 0;
        font-weight: normal;
      }
    }

    .detail-right {
      width: 15%;
    }
  }

  .detail-card {
    margin-top: 15px;
    //padding: 20px 10px;
    background-color: var(--el-bg-color-overlay);
  }
}

// 万维广告位
.advertising {
  position: fixed;
  bottom: 15px;
  left: 10px;
  width: 200px;
}
</style>
