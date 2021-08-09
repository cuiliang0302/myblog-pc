<template>
  <section class="detail">
    <NavMenu :activeMenu="'1'"></NavMenu>
    <div class="page">
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
        <div class="body">
          <v-md-preview :text="article.body" @image-click="showImg"></v-md-preview>
          <el-image-viewer v-if="images.isShow" :initial-index="images.currentIndex"
                           :url-list="images.MDimages" @close="images.isShow=false">
          </el-image-viewer>
        </div>
      </div>
    </div>
    <Footer></Footer>
    <BackTop></BackTop>
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
} from 'element-plus'
import {getArticleDetail} from "@/api/blog";
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {getImgProxy} from "@/api/public";
import timeFormat from "@/utils/timeFormat";
import icon from "@/utils/icon";

let {MyIcon} = icon()
let {timeFull} = timeFormat()
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
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
});
const router = useRouter()
//跳转文章列表
const toCategory = (categoryId) => {
  router.push({path: `/category/${categoryId}`})
}
// 当前文章id
const articleID = ref()
// 文章详情数据
const article = reactive({})

// 获取文章详情
async function articleData(DetailID) {
  const detail_data = await getArticleDetail(DetailID)
  for (let i in detail_data) {
    if (i === 'body') {
      // 图片防盗链处理
      article.body = detail_data.body
      const pattern = /!\[(.*?)\]\((.*?)\)/gm;
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
}

const images = reactive({
  MDimages: [],
  currentIndex: 0,
  isShow: false,
})
// markdown图片查看
const showImg = (MDimages, currentIndex) => {
  images.MDimages = MDimages
  images.currentIndex = currentIndex
  images.isShow = true
}
onMounted(() => {
  articleID.value = router.currentRoute.value.params.id
  articleData(articleID.value)
})
</script>

<style scoped lang="scss">
.detail {
  .detail-card {
    margin-top: 15px;
    padding: 20px 10px;
    background-color: $color-background-white;
  }

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
      margin: 10px 110px;
      border-radius: 20px;

      > span {
        margin: 0 25px;
      }

      span:nth-child(2) {
        span:nth-child(2) {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
