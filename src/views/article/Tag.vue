<template>
  <section class="article-tag">
    <NavMenu></NavMenu>
    <div class="page">
      <article class="animate__animated animate__fadeInLeft">
        <div class="current-position">
          <span>您的位置：</span>
          <span>
            <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章标签</el-breadcrumb-item>
            <el-breadcrumb-item>{{ tagName }}</el-breadcrumb-item>
          </el-breadcrumb>
          </span>
        </div>
        <div class="article-list">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">📜 文章列表</span>
              </div>
            </template>
            <ul>
              <li v-for="item in article.list" :key="item.id">
                <ArticleItem :article="item"></ArticleItem>
              </li>
            </ul>
            <div class="paging">
              <Pagination :total="parseInt(article.count)" @changePage="changePage"></Pagination>
            </div>
          </el-card>
        </div>
      </article>
      <aside>
        <Aside></Aside>
      </aside>
    </div>
    <Footer></Footer>
    <BackTop></BackTop>
  </section>
</template>

<script setup name="Tag">
import NavMenu from "@/components/common/NavMenu.vue";
import ArticleItem from "@/components/common/ArticleItem.vue";
import Aside from "@/components/common/Aside.vue"
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import Pagination from "@/components/common/Pagination.vue"
import {onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getArticle, getCategoryName, getTagName} from "@/api/blog";

const router = useRouter()
// 当前文章id
const tagID = ref()
// 文章标签名
const tagName = ref('')

// 获取文章标签名称
async function tagNameData(tagID) {
  let data = await getTagName(tagID)
  console.log(data)
  tagName.value = data.name
}

// 文章列表
const article = reactive({
  list: [],
  count: '',
})

// 获取文章数据
async function articleData(page, size, tagID) {
  const params = {
    page: 1,
    size: 5,
    ordering: '-created_time',
    tag: tagID
  }
  let data = await getArticle(params)
  article.list = data.results
  article.count = data.count
  console.log(article.list, article.count)
}

// 分页-页面跳转
const changePage = (pageSize, pageNumber) => {
  console.log(tagID)
  window.scrollTo({top: 0})
  articleData(pageNumber, pageSize, tagID.value)
}

onMounted(() => {
  tagID.value = router.currentRoute.value.params.id
  tagNameData(tagID.value)
  articleData(1, 10, tagID.value)
})
onBeforeRouteUpdate(async (to) => {
  tagID.value = to.params.id
  await tagNameData(tagID.value)
  await articleData(1, 10, tagID.value)
});
</script>

<style scoped lang="scss">
.article-tag {
  .article-list {
    margin-top: 15px;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
      }
    }

    .paging {

    }
  }
}
</style>
