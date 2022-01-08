<template>
  <div v-title="sectionData.title+'-'+sitename">
    <section class="detail" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
      <NavMenu :activeMenu="activeMenu"></NavMenu>
      <div class="detail-page">
        <div :class="'detail-left animate__animated animate__'+ (catalogShow===true?'fadeIn':'fadeOut')">
          <el-tree v-if="catalogShow" accordion :data="catalogList" @node-click="handleNodeClick"
                   :default-expanded-keys="expanded" node-key="id" :highlight-current="true"
                   :current-node-key="current" ref="treeRef"></el-tree>
        </div>
        <div class="detail-center">
          <div class="current-position">
            <span>您的位置：</span>
            <span>
            <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a @click="toNote(sectionData.note_id)">
              {{ sectionData.note }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>笔记正文</el-breadcrumb-item>
          </el-breadcrumb>
          </span>
          </div>
          <div class="main detail-card">
            <div v-if="JSON.stringify(sectionData) === '{}'">
              <el-skeleton :rows="20" animated/>
            </div>
            <div v-else>
              <h1>{{ sectionData.title }}</h1>
              <div class="info">
                <span><MyIcon type="icon-category"/>{{ sectionData.note }}</span>
                <span><MyIcon type="icon-time"/>{{ timeFull(sectionData.created_time) }}</span>
                <span><MyIcon type="icon-view"/>{{ sectionData.view }}</span>
                <span><MyIcon type="icon-like"/>{{ sectionData.like }}</span>
                <span><MyIcon type="icon-collect"/>{{ sectionData.collect }}</span>
                <span><MyIcon type="icon-comment"/>{{ sectionData.comment }}</span>
              </div>
              <MarkDown :text="sectionData.body"></MarkDown>
            </div>
            <div class="context">
            <span :class="context.last?'detail-context-hover':''" @click="toDetail(context.last.id)">
              <p><MyIcon type="icon-last"/></p>
              <p v-if="context.last">{{ context.last.title }}</p>
              <p v-else>已是第一篇</p>
            </span>
              <span :class="context.next?'detail-context-hover':''" @click="toDetail(context.next.id)">
              <p><MyIcon type="icon-next"/></p>
              <p v-if="context.next">{{ context.next.title }}</p>
              <p v-else>已是最后一篇</p>
            </span>
            </div>
          </div>
          <div class="comments detail-card" id="comment">
            <h2>📝 评论交流</h2>
            <div class="input-field">
              <span v-if="isLogin===true"><el-avatar :size="50" :src="photo"></el-avatar></span>
              <span v-else><el-avatar :size="50" :src="logo"></el-avatar></span>
              <span><Editor ref="messageEditor"></Editor></span>
              <span v-if="isLogin===true"><el-button type="primary" round @click="clickSend">评论</el-button></span>
              <span v-else><el-button type="primary" round @click="showLogin">登录</el-button></span>
            </div>
            <div class="comment-list">
              <Comments :comments-list="commentsList"></Comments>
            </div>
          </div>
        </div>
        <div class="detail-right">
          <Outline @rollTo="rollTo" :scrollTop="scrollTop"></Outline>
          <Action :detailType="'section'" @setCatalog="catalogShow=!catalogShow" :catalogShow="catalogShow"
                  @likeClick="likeClick" :isCollect="isCollect"></Action>
          <BackTop></BackTop>
        </div>
      </div>
      <Footer></Footer>
      <LoginPopup ref="loginPopupRef"></LoginPopup>
    </section>
  </div>
</template>

<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import MarkDown from "@/components/detail/MarkDown.vue"
import Action from "@/components/detail/Action.vue"
import Outline from "@/components/detail/Outline.vue"
import Editor from "@/components/common/Editor.vue"
import Comments from "@/components/common/Comments.vue"
import {ElMessage, ElLoading} from 'element-plus'
import {getSectionDetail, getContextSection, getCatalogue, putSectionDetail} from "@/api/blog";
import {onMounted, reactive, ref, onBeforeUnmount, nextTick, getCurrentInstance} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getImgProxy} from "@/api/public";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";
import store from "@/store";
import {getSiteConfig} from "@/api/management";
import {
  deleteSectionComment,
  getSectionComment,
  getSectionHistory,
  postReplySectionComment,
  postSectionComment,
  putSectionComment
} from "@/api/record";
import user from "@/utils/user";
import {getUserinfoId} from "@/api/account";
// 引入用户信息模块
let {userId, isLogin} = user();
let {MyIcon} = icon()
let {timeFull} = timeFormat()
const router = useRouter()
// 引入公共模块
let {sectionID, activeMenu, loading, toNote, sitename, toDetail} = publicFn()
// 引入笔记内容模块
let {sectionData, context, getSectionData, contextData} = section()
// 引入笔记目录模块
let {
  catalogShow,
  catalogList,
  expanded,
  current,
  catalogueData,
  handleNodeClick,
  findCatalogId,
  treeRef
} = catalog(sectionData)
// 引入markdown模块
let {rollTo, scrollTop, scroll} = markdown()
// 调用评论回复模块
let {commentsList, getSectionCommentData, logo, photo, messageEditor, loginPopupRef, messageForm} = comment(sectionID)
// 调用动作菜单模块
let {likeClick, isCollect} = action(sectionID, sectionData)
// 弹出登录框
const showLogin = () => {
  store.commit('setNextPath', router.currentRoute.value.fullPath)
  loginPopupRef.value.showPopup()
}
// 点击发表评论事件
const clickSend = () => {
  messageEditor.value.syncHTML()
  messageForm.content = messageEditor.value.content
  console.log(messageForm.content)
  if (messageForm.content) {
    messageForm.user = userId.value
    messageForm['section_id'] = sectionID.value
    console.log(messageForm)
    postSectionComment(messageForm).then((response) => {
      console.log(response)
      ElMessage({
        message: '评论成功！',
        type: 'success',
      })
      messageForm.content = ''
      messageEditor.value.clear()
      getSectionCommentData()
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
onMounted(async () => {
  window.scrollTo({top: 0})
  store.commit('setOutline', '')
  sectionID.value = router.currentRoute.value.params.id
  await getSectionData(sectionID.value)
  await catalogueData(sectionData.note_id)
  await findCatalogId(sectionID.value)
  await contextData(sectionID.value)
  window.addEventListener('scroll', scroll())
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll())
  store.commit('setOutline', '')
})
onBeforeRouteUpdate(async (to) => {
  window.scrollTo({top: 0})
  // console.log(to)
  store.commit('setOutline', '')
  for (let key in context) {
    delete context[key];
  }
  loading.value = true
  await getSectionData(to.params.id)
  await contextData(to.params.id)
  await getSectionCommentData(to.params.id)
});

// 公共模块
function publicFn() {
  // 当前笔记id
  const sectionID = ref()
  // 当前导航栏id
  const activeMenu = ref()
  // 是否开启加载中动画
  const loading = ref(false)
  //跳转笔记列表
  const toNote = (noteId) => {
    router.push({path: `/note/${noteId}`})
  }
  // 站点名称
  const sitename = ref('')

  // 获取站点名称
  async function siteConfigData() {
    let siteConfig_data = await getSiteConfig()
    // console.log(siteConfig_data)
    sitename.value = siteConfig_data.name
  }

  // 点击跳转其他笔记事件
  const toDetail = (detailID) => {
    sectionID.value = detailID
    findCatalogId(sectionID.value)
    router.push({path: `/detail/section/${sectionID.value}`})
  }
  onMounted(() => {
    siteConfigData()
  })
  return {sectionID, activeMenu, loading, toNote, sitename, toDetail}
}

// 笔记目录模块
function catalog(sectionData) {
  // 笔记目录是否显示
  const catalogShow = ref(true)
  // 树形组件对象
  const treeRef = ref(null)
  // 笔记目录列表
  const catalogList = ref([])
  // 当前笔记展开的目录id
  const expanded = ref([])
  // 当前高亮的笔记目录id
  const current = ref()

  // 获取笔记目录数据
  async function catalogueData() {
    let data = await getCatalogue(sectionData.note_id)
    catalogList.value = data.map((i, index) => {
      return {
        id: i['id'],
        label: '第' + (index + 1) + '章：' + i['name'],
        children: i['child'].map((j, index) => {
          return {
            id: j['id'],
            section_id: j['section_id'],
            label: (index + 1) + '. ' + j['name'],
            children: NaN
          }
        })
      }
    })
  }

  // 点击跳转指定笔记
  const handleNodeClick = (data) => {
    if (!data.children) {
      // console.log(sectionID.value)
      sectionID.value = data.section_id
      findCatalogId(sectionID.value)
      router.push({path: `/detail/section/${data.section_id}`})
    }
  }
  // 查找笔记id对应的目录id
  const findCatalogId = (sectionId) => {
    catalogList.value.forEach((i) => {
      i.children.forEach((j) => {
        if (j.section_id === parseInt(sectionId)) {
          expanded.value = [i.id]
          treeRef.value.setCurrentKey(j.id)
          return false
        }
      })
    })
  }
  return {catalogShow, catalogList, expanded, current, catalogueData, handleNodeClick, findCatalogId, treeRef}
}

// 笔记内容模块
function section() {
  // 笔记详情数据
  const sectionData = reactive({})
  // 笔记上下篇
  const context = reactive({})

  // 获取笔记详情
  async function getSectionData(DetailID) {
    const detail_data = await getSectionDetail(DetailID)
    for (let i in detail_data) {
      if (i === 'body') {
        // 图片防盗链处理
        sectionData.body = detail_data.body
        const pattern = /!\[(.*?)\]\((https:\/\/cdn.nlark.com.*?)\)/gm;
        let matcher;
        let imgArr = [];
        while ((matcher = pattern.exec(sectionData.body)) !== null) {
          imgArr.push(matcher[2]);
        }
        for (let i = 0; i < imgArr.length; i++) {
          sectionData.body = sectionData.body.replace(
              imgArr[i],
              getImgProxy(imgArr[i])
          );
        }
      } else {
        sectionData[i] = detail_data[i]
      }
    }
    activeMenu.value = "3-" + sectionData.note_id
    loading.value = false
  }

  // 获取笔记上下篇
  async function contextData(DetailID) {
    Object.assign(context, await getContextSection(DetailID));
    // console.log(context)
  }

  return {sectionData, context, getSectionData, contextData}
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
  const scrollTop = ref()
  // markdown-页面滚动
  const scroll = () => {
    let timeOut = null; // 初始化空定时器
    return () => {
      clearTimeout(timeOut)   // 频繁操作，一直清空先前的定时器
      timeOut = setTimeout(() => {  // 只执行最后一次事件
        scrollTop.value = window.pageYOffset
      }, 500)
    }
  }
  return {rollTo, scrollTop, scroll}
}

// 评论回复点赞模块
function comment(sectionID) {
  // 事件总线
  const internalInstance = getCurrentInstance();  //当前组件实例
  const $bus = internalInstance.appContext.config.globalProperties.$bus;
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

  // 留言评论列表
  const commentsList = ref([])

  // 获取笔记评论数据
  async function getSectionCommentData() {
    await nextTick()
    commentsList.value = await getSectionComment(sectionID.value)
    console.log("commentsList", commentsList.value)
  }

  // 弹窗登录对象
  const loginPopupRef = ref(null)
  // 评论编辑器对象
  const messageEditor = ref(null)
  // 评论表单
  const messageForm = reactive({
    content: '',
    user: '',
  })
  // 评论点赞事件
  if (!$bus.all.get("likeMessage")) $bus.on("likeMessage", messageId => {
    putSectionComment(messageId).then((response) => {
      console.log(response)
      ElMessage({
        message: '点赞成功',
        type: 'success',
      })
      getSectionCommentData()
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  });
  // 留言回复事件
  if (!$bus.all.get("replySend")) $bus.on("replySend", replyForm => {
    replyForm['section_id'] = sectionID.value
    console.log(replyForm)
    postReplySectionComment(replyForm).then((response) => {
      console.log(response)
      ElMessage({
        message: '回复成功！',
        type: 'success',
      })
      getSectionCommentData()
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      for (let i in response) {
        ElMessage.error(i + response[i][0])
      }
    });
  });
  // 评论删除事件
  if (!$bus.all.get("delMessage")) $bus.on("delMessage", messageId => {
    deleteSectionComment(messageId).then((response) => {
      console.log(response)
      ElMessage({
        message: '评论删除成功！',
        type: 'success',
      })
      getSectionCommentData()
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  });
  onMounted(() => {
    getSectionCommentData()
    if (isLogin.value === true) {
      getPhotoData()
    } else {
      getLogoData()
    }
  })
  return {
    commentsList, getSectionCommentData, logo, photo, messageEditor, loginPopupRef, messageForm
  }
}

// 动作菜单模块
function action(sectionID, sectionData) {
  // 引入用户信息模块
  let {userId, isLogin} = user();
  // 笔记点赞事件
  const likeClick = () => {
    console.log("爹收到点赞事件了")
    sectionData.like = sectionData.like + 1
    putSectionDetail(sectionID.value, sectionData).then((response) => {
      console.log(response)
      ElMessage({
        message: '笔记点赞成功！',
        type: 'success',
      })
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  }
  // 笔记收藏状态
  const isCollect = ref(false)

  // 获取笔记浏览记录（是否已收藏）
  async function getSectionHistoryData() {
    await nextTick()
    if (isLogin.value === true) {
      let res = await getSectionHistory(sectionID.value, userId.value)
      console.log(res)
      isCollect.value = res.is_collect
      console.log(isCollect.value)
    }
  }

  onMounted(() => {
    getSectionHistoryData()
  })
  return {
    likeClick, isCollect
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
      width: 15%;

      .el-tree {
        width: 15%;
        position: fixed;
        background-color: $color-background-base;
      }
    }

    .detail-center {
      width: 70%;

      .main {
        h1 {
          text-align: center;
          margin: 20px 0;
        }

        .info {
          display: flex;
          justify-content: center;
          align-items: center;
          color: $color-text-regular;
          background-color: $color-other-clouds;
          padding: 5px 0px;
          margin: 10px 30px;
          border-radius: 20px;

          > span {
            margin: 0 4%;

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
          color: $color-text-regular;
          background-color: $color-background-base;
          margin: 10px 30px;
          padding: 10px 10px;
          border-radius: 10px;

          span {
            flex: 1;
            text-align: center;

            .anticon {
              color: $color-primary;
              margin: 0 10px;
              font-size: 25px;
            }

            p {
              margin: 15px 0;
            }
          }

          > span:nth-child(2) {
            border-left: 2px solid $color-text-placeholder;

            span {
              margin: 0 5px
            }
          }
        }
      }

      .comments {
        margin-bottom: 15px;

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
          padding: 0px 25px 0px 5px;
        }
      }

      h2 {
        border-bottom: 1px solid $color-border-base;
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
    padding: 20px 10px;
    background-color: $color-background-white;
  }
}
</style>
