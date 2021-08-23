<template>
  <section class="detail" v-loading="loading"
           element-loading-text="拼命加载中"
           element-loading-spinner="el-icon-loading">
    <NavMenu :activeMenu="activeMenu"></NavMenu>
    <div class="detail-page">
      <div class="detail-left">
        <!--        这是左边部分-->
      </div>
      <div class="detail-center">
        <div class="current-position">
          <span>您的位置：</span>
          <span>
            <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item><a @click="toCategory(article.category_id)">
              {{ article.category }}</a></el-breadcrumb-item>
            <el-breadcrumb-item>文章正文</el-breadcrumb-item>
          </el-breadcrumb>
          </span>
        </div>
        <div class="main detail-card">
          <div v-if="JSON.stringify(article) == '{}'">
            <el-skeleton :rows="20" animated/>
          </div>
          <div v-else>
            <h1>{{ article.title }}</h1>
            <div class="info">
              <span><MyIcon type="icon-category"/>{{ article.category }}</span>
              <span><MyIcon type="icon-tag"/>
                  <span v-for="(tag,index) in article.tags" :key="index">{{ tag.name }}</span>
                </span>
              <span><MyIcon type="icon-time"/>{{ timeFull(article.created_time) }}</span>
              <span><MyIcon type="icon-view"/>{{ article.view }}</span>
              <span><MyIcon type="icon-like"/>{{ article.like }}</span>
              <span><MyIcon type="icon-collect"/>{{ article.collect }}</span>
              <span><MyIcon type="icon-comment"/>{{ article.comment }}</span>
            </div>
            <MarkDown :text="article.body"></MarkDown>
          </div>
          <div class="context">
            <span :class="context.last?'detail-context-hover':''" @click="toDetail(context.last.id)">
              <p><MyIcon type="icon-last"/></p>
              <p v-if="context.last">{{ context.last.title }}</p>
              <p v-else>已是第一篇</p>
            </span>
            <span>
              <p>文章分类：
                <span class="tag article-tag-hover" :style="'background-color: '+tagColor(article.category_id)">
                  {{ article.category }}
                </span>
              </p>
              <p>文章标签：
                <span v-for="item in article.tags" class="tag article-tag-hover"
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
        <div class="comments detail-card">
          <h2>📝 评论交流</h2>
          <div>
            这是评论内容，占个位先
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
</template>

<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import Loading from "@/components/common/Loading.vue"
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
} from 'element-plus'
import {getArticleDetail, getContextArticle, getGuessLike} from "@/api/blog";
import {onMounted, reactive, ref, onBeforeUnmount} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getImgProxy} from "@/api/public";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";
import setColor from "@/utils/setColor";
import store from "@/store";

let {MyIcon} = icon()
let {timeFull} = timeFormat()
let {tagColor} = setColor()
const router = useRouter()
//跳转文章列表
const toCategory = (categoryId) => {
  router.push({path: `/category/${categoryId}`})
}
// 当前文章id
const articleID = ref()
// 文章详情数据
const article = reactive({})
// 当前文章分类id
const activeMenu = ref()
// 文章上下篇
const context = reactive({})
// 猜你喜欢
const recommendList = ref([])
// 是否开启加载中动画
const loading = ref(false)

// 获取文章详情
async function articleData(DetailID) {
  const detail_data = await getArticleDetail(DetailID)
  for (let i in detail_data) {
    if (i === 'body') {
      // 图片防盗链处理
      article.body = detail_data.body
      const pattern = /!\[(.*?)\]\((https:\/\/cdn.nlark.com.*?)\)/gm;
      let matcher;
      let imgArr = [];
      while ((matcher = pattern.exec(article.body)) !== null) {
        imgArr.push(matcher[2]);
      }
      for (let i = 0; i < imgArr.length; i++) {
        article.body = article.body.replace(
            imgArr[i],
            getImgProxy(imgArr[i])
        );
      }
    } else {
      article[i] = detail_data[i]
    }
  }
  console.log(article)
  activeMenu.value = "2-" + article.category_id
  loading.value = false
}

// 获取文章上下篇
async function contextData(DetailID) {
  Object.assign(context, await getContextArticle(DetailID));
  console.log(context)
}

// 获取猜你喜欢
async function guessLikeData(DetailID) {
  recommendList.value = await getGuessLike(DetailID)
  console.log(recommendList.value)
}

// 点击跳转其他文章事件
const toDetail = (detailID) => {
  articleID.value = detailID
  router.push({path: `/detail/article/${articleID.value}`})
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
  articleID.value = router.currentRoute.value.params.id
  await articleData(articleID.value)
  await contextData(articleID.value)
  await guessLikeData(articleID.value)
  window.addEventListener('scroll', scroll())
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll())
  store.commit('setOutline', '')
})
onBeforeRouteUpdate(async (to) => {
  console.log(to)
  for(let key in context){
    delete context[key];
  }
  loading.value = true
  await articleData(to.params.id)
  await contextData(to.params.id)
  await guessLikeData(to.params.id)
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
            border-right: 2px solid $color-text-placeholder;

            span {
              margin: 0 5px
            }
          }
        }
      }

      .guess {
        > div {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 10px 0px;

          &:hover {
            span {
              opacity: 0.5;
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
              color: $color-text-secondary;
              margin: 10px 0px;
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
