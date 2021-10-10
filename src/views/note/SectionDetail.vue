<template>
  <div v-title="section.title+'-'+sitename">
    <section class="detail" v-loading="loading"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading">
      <NavMenu :activeMenu="activeMenu"></NavMenu>
      <div class="detail-page">
        <div class="detail-left">
          <el-tree accordion :data="catalogList" @node-click="handleNodeClick"
                   :default-expanded-keys="expanded" node-key="id" :highlight-current="true"
                   :current-node-key="current"></el-tree>
        </div>
        <div class="detail-center">
          <div class="current-position">
            <span>您的位置：</span>
            <span>
            <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a @click="toNote(section.note_id)">
              {{ section.note }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>笔记正文</el-breadcrumb-item>
          </el-breadcrumb>
          </span>
          </div>
          <div class="main detail-card">
            <div v-if="JSON.stringify(section) == '{}'">
              <el-skeleton :rows="20" animated/>
            </div>
            <div v-else>
              <h1>{{ section.title }}</h1>
              <h1>展开目录{{ expanded }},高亮文章id{{ current }}</h1>
              <div class="info">
                <span><MyIcon type="icon-category"/>{{ section.note }}</span>
                <span><MyIcon type="icon-time"/>{{ timeFull(section.created_time) }}</span>
                <span><MyIcon type="icon-view"/>{{ section.view }}</span>
                <span><MyIcon type="icon-like"/>{{ section.like }}</span>
                <span><MyIcon type="icon-collect"/>{{ section.collect }}</span>
                <span><MyIcon type="icon-comment"/>{{ section.comment }}</span>
              </div>
              <MarkDown :text="section.body"></MarkDown>
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
          <div class="comments detail-card">
            <h2>📝 评论交流</h2>
            <div>
              评论模块正在开发中，敬请期待！
            </div>
          </div>
        </div>
        <div class="detail-right">
          <Outline @rollTo="rollTo" :scrollTop="scrollTop"></Outline>
          <Action></Action>
          <BackTop></BackTop>
        </div>
      </div>
      <Footer></Footer>
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
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElSkeleton,
  ElImage,
  ElTree,
} from 'element-plus'
import {getSectionDetail, getContextSection, getCatalogue} from "@/api/blog";
import {onMounted, reactive, ref, onBeforeUnmount} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getImgProxy} from "@/api/public";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";
import setColor from "@/utils/setColor";
import store from "@/store";
import {getSiteConfig} from "@/api/management";

let {MyIcon} = icon()
let {timeFull} = timeFormat()
let {tagColor} = setColor()
const router = useRouter()
// 当前笔记id
const sectionID = ref()
// 笔记详情数据
const section = reactive({})
// 当前笔记分类id
const activeMenu = ref()
// 笔记上下篇
const context = reactive({})
// 猜你喜欢
const recommendList = ref([])
// 是否开启加载中动画
const loading = ref(false)
// 笔记目录列表
const catalogList = ref([])
// 当前笔记展开的目录id
const expanded = ref([])
// 当前高亮的笔记目录id
const current = ref()
//跳转笔记列表
const toNote = (noteId) => {
  router.push({path: `/note/${noteId}`})
}
// 站点名称
const sitename = ref('')

// 获取站点名称
async function siteConfigData() {
  let siteConfig_data = await getSiteConfig()
  console.log(siteConfig_data)
  sitename.value = siteConfig_data.name
}

// 获取笔记目录数据
async function catalogueData(catalogueID) {
  let data = await getCatalogue(catalogueID)
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
  return Promise.resolve('')
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
        // current.value = j.id
        return false
      }
    })
  })
}

// 获取笔记详情
async function sectionData(DetailID) {
  const detail_data = await getSectionDetail(DetailID)
  for (let i in detail_data) {
    if (i === 'body') {
      // 图片防盗链处理
      section.body = detail_data.body
      const pattern = /!\[(.*?)\]\((https:\/\/cdn.nlark.com.*?)\)/gm;
      let matcher;
      let imgArr = [];
      while ((matcher = pattern.exec(section.body)) !== null) {
        imgArr.push(matcher[2]);
      }
      for (let i = 0; i < imgArr.length; i++) {
        section.body = section.body.replace(
            imgArr[i],
            getImgProxy(imgArr[i])
        );
      }
    } else {
      section[i] = detail_data[i]
    }
  }
  // console.log(section)
  activeMenu.value = "3-" + section.note_id
  loading.value = false
}

// 获取笔记上下篇
async function contextData(DetailID) {
  Object.assign(context, await getContextSection(DetailID));
  // console.log(context)
}

// 点击跳转其他笔记事件
const toDetail = (detailID) => {
  sectionID.value = detailID
  findCatalogId(sectionID.value)
  router.push({path: `/detail/section/${sectionID.value}`})
}
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
onMounted(async () => {
  store.commit('setOutline', '')
  sectionID.value = router.currentRoute.value.params.id
  await sectionData(sectionID.value)
  await catalogueData(section.note_id)
  current.value = 13
  await findCatalogId(sectionID.value)
  await contextData(sectionID.value)
  await siteConfigData()
  window.addEventListener('scroll', scroll())
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll())
  store.commit('setOutline', '')
})
onBeforeRouteUpdate(async (to) => {
  // console.log(to)
  store.commit('setOutline', '')
  for (let key in context) {
    delete context[key];
  }
  // sectionID.value = to.params.id
  loading.value = true
  await sectionData(sectionID.value)
  await contextData(sectionID.value)
  window.scrollTo({top: 0})
});
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
