<template>
  <div v-title="sectionData.title+'-'+siteName">
    <section class="detail">
      <NavMenu></NavMenu>
      <div class="detail-page">
        <div :class="'detail-left animate__animated animate__'+ (catalogShow===true?'fadeIn':'fadeOut')">
          <el-tree v-if="catalogShow" accordion :data="catalogList" @node-click="handleNodeClick"
                   :default-expanded-keys="expanded" node-key="id" :highlight-current="true"
                   :current-node-key="current" ref="treeRef"></el-tree>
          <div class="wwads-cn wwads-vertical wwads-sticky advertising" data-id="259"></div>
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
              <span v-if="user.isLoggedIn===true"><el-avatar :size="50" :src="photo"></el-avatar></span>
              <span v-else><el-avatar :size="50" :src="logo"></el-avatar></span>
              <span><Editor ref="messageEditor"></Editor></span>
              <span v-if="user.isLoggedIn===true"><el-button type="primary" round @click="clickSend">评论</el-button></span>
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
                  @likeClick="likeClick" :isCollect="isCollect" @collectClick="collectClick"></Action>
          <BackTop></BackTop>
        </div>
      </div>
      <Footer></Footer>
      <LoginPopup ref="loginPopupRef"></LoginPopup>
    </section>
  </div>
</template>

<script setup name="SectionDetail">
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import MarkDown from "@/components/detail/MarkDown.vue"
import Action from "@/components/detail/Action.vue"
import Outline from "@/components/detail/Outline.vue"
import Editor from "@/components/common/Editor.vue"
import Comments from "@/components/common/Comments.vue"
import {ElMessage, ElLoading} from 'element-plus'
import {getSectionDetail, getContextSection, getCatalogueList, postLike} from "@/api/blog";
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
  postSectionComment, postSectionHistory,
  patchSectionComment, putSectionHistory
} from "@/api/record";
import {getUserinfoId} from "@/api/account";
import { inject } from 'vue';
import useStore from "@/store";
import {storeToRefs} from 'pinia'
const {user,common} = useStore();
let {MyIcon} = icon()
let {timeFull} = timeFormat()
const router = useRouter()
const reload = inject("reload");
// 引入公共模块
let {sectionID, toNote, siteName, toDetail} = publicFn()
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
// 弹窗登录对象
const loginPopupRef = ref(null)
// 评论编辑器对象
const messageEditor = ref(null)
// 调用评论回复模块
let {
  commentsList,
  getSectionCommentData,
  logo,
  photo,
  showLogin,
  clickSend
} = comment(sectionID, loginPopupRef, messageEditor)
// 调用动作菜单模块
let {likeClick, isCollect, collectClick, getSectionHistoryData, postSectionHistoryData} = action(sectionID, sectionData)
onMounted(async () => {
  // 开启加载中动画
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中……',
    background: 'rgba(255, 255, 255, 0.3)',
  })
  window.scrollTo({top: 0})
  common.setOutlineList('')
  sectionID.value = router.currentRoute.value.params.id
  await getSectionData(sectionID.value)
  loading.close()
  await catalogueData(sectionData.note_id)
  await findCatalogId(sectionID.value)
  await contextData(sectionID.value)
  await postSectionHistoryData(sectionID.value)
  window.addEventListener('scroll', scroll())
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll())
  common.setOutlineList('')
})
onBeforeRouteUpdate(async (to) => {
  // 开启加载中动画
  const loading = ElLoading.service({
    lock: true,
    text: '正在加载中……',
    background: 'rgba(255, 255, 255, 0.3)',
  })
  window.scrollTo({top: 0})
  common.setOutlineList('')
  for (let key in context) {
    delete context[key];
  }
  await getSectionData(to.params.id)
  loading.close()
  await contextData(to.params.id)
  await getSectionCommentData(to.params.id)
  await getSectionHistoryData()
  await postSectionHistoryData(to.params.id)
});

// 公共模块
function publicFn() {
  // 当前笔记id
  const sectionID = ref()
  //跳转笔记列表
  const toNote = (noteId) => {
    // console.log(noteId)
    router.push({path: `/catalog/${noteId}`})
  }
  // 站点名称
  const siteName = ref('')

  // 获取站点名称
  async function siteConfigData() {
    let siteConfig_data = await getSiteConfig()
    // console.log(siteConfig_data)
    siteName.value = siteConfig_data.name
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
  return {sectionID, toNote, siteName, toDetail}
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
    let data = await getCatalogueList(sectionData.note_id)
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
  // 当前导航栏id
  const activeMenu = ref()
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
    common.setMenuIndex(activeMenu.value)
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
    let data = await getUserinfoId(user.user_id)
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

  // 评论表单
  const messageForm = reactive({
    content: '',
    user: '',
    url:'',
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
      messageForm['section_id'] = sectionID.value
      messageForm['url'] = window.location.href
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
  if (!$bus.all.get("likeMessage")) $bus.on("likeMessage", value => {
    const params = {'like': value.like}
    patchSectionComment(value.id, params).then((response) => {
      console.log(response)
      ElMessage({
        message: '点赞成功',
        type: 'success',
      })
      // getSectionCommentData()
      reload();
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  });
  // 留言回复事件
  if (!$bus.all.get("replySend")) $bus.on("replySend", replyForm => {
    replyForm['section_id'] = sectionID.value
    replyForm['url'] = window.location.href
    console.log(replyForm)
    postReplySectionComment(replyForm).then((response) => {
      console.log(response)
      ElMessage({
        message: '回复成功！',
        type: 'success',
      })
      getSectionCommentData()
      reload();
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
      reload();
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  });
  onMounted(() => {
    getSectionCommentData()
    if (user.isLoggedIn === true) {
      getPhotoData()
    } else {
      getLogoData()
    }
  })
  return {
    commentsList, getSectionCommentData, logo, photo, messageForm, showLogin, clickSend
  }
}

// 动作菜单模块
function action(sectionID, sectionData) {
  // 笔记点赞事件
  const likeClick = () => {
    const params = {id: sectionID.value, 'kind': 'section'}
    sectionData.like = sectionData.like + 1
    postLike(params).then((response) => {
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
    if (user.isLoggedIn === true) {
      let res = await getSectionHistory(sectionID.value, user.user_id)
      console.log(res)
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
      CollectForm['section_id'] = sectionID
      putSectionHistory(CollectForm).then((response) => {
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
  // 添加笔记浏览记录表单
  const sectionHistoryForm = reactive({
    section_id: '',
    user: ''
  })

  // 添加笔记浏览记录
  async function postSectionHistoryData(section_id) {
    if (user.isLoggedIn === true) {
      sectionHistoryForm.section_id = section_id
      sectionHistoryForm.user = user.user_id
      console.log(sectionHistoryForm)
      let res = await postSectionHistory(sectionHistoryForm)
      console.log(res)
    }
  }

  onMounted(() => {
    getSectionHistoryData()
  })
  return {
    likeClick, isCollect, collectClick, getSectionHistoryData, postSectionHistoryData
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
        height: 82vh;
        overflow-x: hidden; /* 水平隐藏 */
        overflow-y: auto; /* 垂直滚动 */
        width: 15%;
        position: fixed;
        background-color: var(--el-background-color-base);
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
          color: var(--el-text-color-regular);
          background-color: var(--el-border-color);
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
    padding: 20px 10px;
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
