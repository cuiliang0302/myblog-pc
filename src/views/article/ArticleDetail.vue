<template>
  <section class="detail">
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
            <div class="body" ref="editor">
              <v-md-preview :text="article.body" @image-click="showImg"
                            @copy-code-success="handleCopyCodeSuccess"></v-md-preview>
            </div>
            <el-image-viewer v-if="images.isShow" :initial-index="images.currentIndex"
                             :url-list="images.MDimages" @close="images.isShow=false">
            </el-image-viewer>
          </div>
          <div class="context">
            <span :class="context.last?'detail-context-hover':''">
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
            <span :class="context.next?'detail-context-hover':''">
              <p><MyIcon type="icon-next"/></p>
              <p v-if="context.next">{{ context.next.title }}</p>
              <p v-else>已是最后一篇</p>
            </span>
          </div>
        </div>
        <div class="guess detail-card">
          <h2>💖 猜你喜欢</h2>
          <div>
            <span class="recommend-hover" v-for="item in recommendList">
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
        <div
            :class="'outline  animate__animated animate__'+ (outlineShow===true?'fadeInRight':'fadeOutRight')">
          <div v-if="titleList.length !== 0">
            <p v-for="(anchor,index) in titleList" :key="anchor.lineIndex"
               :style="{ padding: `0px 0 0px ${anchor.indent * 15}px` }"
               @click="rollTo(anchor,index)" :class="index===heightTitle?'title-active':''"
            >
              {{ anchor.title }}
            </p>
          </div>
          <div v-else>
            <el-empty description="该文章暂无大纲"></el-empty>
          </div>
        </div>
        <div class="action">
          <el-tooltip class="item" effect="dark" content="大纲" placement="left">
            <div @click="outlineShow=!outlineShow" class="detail-active-hover">
              <MyIcon type="icon-outline"/>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="点赞" placement="left">
            <div class="detail-active-hover">
              <MyIcon type="icon-like"/>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="收藏" placement="left">
            <div class="detail-active-hover">
              <MyIcon type="icon-collect"/>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="评论" placement="left">
            <div class="detail-active-hover">
              <MyIcon type="icon-comment"/>
            </div>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="打赏" placement="left">
            <div class="detail-active-hover">
              <MyIcon type="icon-exceptional"/>
            </div>
          </el-tooltip>
          <BackTop></BackTop>
        </div>
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
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElImageViewer,
  ElSkeleton,
  ElTooltip,
  ElMessage,
  ElEmpty,
  ElImage,
} from 'element-plus'
import {getArticleDetail, getContextArticle, getGuessLike} from "@/api/blog";
import {nextTick, onMounted, reactive, ref, onBeforeUnmount} from "vue";
import {useRouter} from "vue-router";
import {getImgProxy} from "@/api/public";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";

let {MyIcon} = icon()
let {timeFull} = timeFormat()
let {tagColor} = setColor()
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import sql from 'highlight.js/lib/languages/sql';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import xml from 'highlight.js/lib/languages/xml';
import setColor from "@/utils/setColor";

hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
VMdPreview.use(githubTheme, {
  codeHighlightExtensionMap: {
    vue: 'xml',
    less: 'scss',
  },
  Hljs: hljs,
}).use(createCopyCodePlugin()).use(createLineNumbertPlugin());
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

// markdown-代码复制
const handleCopyCodeSuccess = () => {
  ElMessage.success({
    message: '代码已复制至剪切板',
    type: 'success'
  });
}
// markdown-图片对象
const images = reactive({
  MDimages: [],
  currentIndex: 0,
  isShow: false,
})
// markdown-图片查看
const showImg = (MDimages, currentIndex) => {
  images.MDimages = MDimages
  images.currentIndex = currentIndex
  images.isShow = true
}

// 大纲模块
// 大纲是否显示
const outlineShow = ref(true)
// markdown-对象
const editor = ref(null)
// markdown-文章标题列表
const titleList = ref([])

// markdown-获取标题
async function getTitle() {
  await nextTick()
  const anchors = editor.value.querySelectorAll(
      '.v-md-editor-preview h1,h2,h3,h4,h5,h6'
  )
  // console.log(anchors)
  const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
  // console.log(titles)
  if (!titles.length) {
    titleList.value = [];
    return;
  }
  const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
  titleList.value = titles.map((el) => ({
    title: el.innerText,
    lineIndex: el.getAttribute('data-v-md-line'),
    indent: hTags.indexOf(el.tagName),
    height: el.offsetTop,
  }));
}

// markdown-标题跳转
const rollTo = (anchor, index) => {
  const {lineIndex} = anchor;
  const heading = editor.value.querySelector(
      `.v-md-editor-preview [data-v-md-line="${lineIndex}"]`
  );
  // console.log(heading)
  if (heading) {
    heading.scrollIntoView({behavior: "smooth", block: "start"})
  }
  heightTitle.value = index
}

// markdown-当前高亮的标题
const heightTitle = ref(0)
// markdown-页面滚动
const scroll = () => {
  let timeOut = null; // 初始化空定时器
  return () => {
    clearTimeout(timeOut)   // 频繁操作，一直清空先前的定时器
    timeOut = setTimeout(() => {  // 只执行最后一次事件
      let scrollTop = window.pageYOffset
      // console.log("当前滚动距离", window.pageYOffset)
      const absList = [] // 各个h标签与当前距离绝对值
      titleList.value.forEach((item) => {
        absList.push(Math.abs(item.height - scrollTop))
      })
      // 屏幕滚动距离与标题具体最近的index高亮
      heightTitle.value = absList.indexOf(Math.min.apply(null, absList))
      // console.log("距离最近的标题index", heightTitle.value)
    }, 500)
  }
}
onMounted(async () => {
  articleID.value = router.currentRoute.value.params.id
  await articleData(articleID.value)
  await getTitle()
  await contextData(articleID.value)
  await guessLikeData(articleID.value)
  window.addEventListener('scroll', scroll())
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll())
})
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

      .outline {
        position: fixed;
        font-size: 13px;
        line-height: 25px;
        color: $color-text-secondary;
        margin-left: 10px;
        height: 82vh;
        overflow: auto;

        p {
          cursor: pointer;
          margin-left: 5px;
          transition: all 0.5s;
        }

        p:hover {
          color: $color-primary;
        }

        .title-active {
          background-color: $color-background-input;
          color: $color-text-primary;
          border-left: 2px solid $color-primary;
        }
      }

      .action {
        position: fixed;
        bottom: 130px;
        width: 40px;
        height: 240px;
        right: 40px;

        > div {
          width: 40px;
          height: 40px;
          background-color: $color-background-white;
          border-radius: 20px;
          box-shadow: 0 0 6px rgb(0 0 0 / 12%);
          cursor: pointer;
          margin-bottom: 10px;
          opacity: 0.7;

          .anticon {
            transform: translate(50%, 50%);
            color: $color-text-regular;
            transition: all 0.5s;
            font-size: 20px
          }
        }
      }
    }
  }

  .detail-card {
    margin-top: 15px;
    padding: 20px 10px;
    background-color: $color-background-white;
  }
}
</style>
