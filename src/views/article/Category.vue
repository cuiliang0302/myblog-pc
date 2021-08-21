<template>
  <section class="category">
    <NavMenu :activeMenu="'2-'+router.currentRoute.value.params.id"></NavMenu>
    <div class="page">
      <article>
        <div class="current-position">
          <span>您的位置：</span>
          <span>
            <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章分类</el-breadcrumb-item>
            <el-breadcrumb-item>{{ categoryName }}</el-breadcrumb-item>
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

<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import ArticleItem from "@/components/common/ArticleItem.vue";
import Aside from "@/components/common/Aside.vue"
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import Pagination from "@/components/common/Pagination.vue"
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
} from 'element-plus'
import {onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getArticle, getCategoryName} from "@/api/blog";

const router = useRouter()
// 当前文章id
const categoryID = ref()
// 文章分类名
const categoryName = ref('')

async function categoryNameData(categoryID) {
  let data = await getCategoryName(categoryID)
  console.log(data)
  categoryName.value = data.name
}

// 文章列表
const article = reactive({
  list: [],
  count: '',
})

async function articleData(page, size, categoryID) {
  let data = await getArticle(page, size, '-created_time', categoryID, NaN)
  article.list = data.results
  article.count = data.count
  console.log(article.list, article.count)
}

// 分页-页面跳转
const changePage = (pageSize, pageNumber) => {
  articleData(pageNumber, pageSize, categoryID.value)
}

onMounted(() => {
  categoryID.value = router.currentRoute.value.params.id
  categoryNameData(categoryID.value)
  articleData(1, 10, categoryID.value)
})
onBeforeRouteUpdate(async (to) => {
  await categoryNameData(to.params.id)
  await articleData(1, 10, to.params.id)
});
</script>

<style scoped lang="scss">
.category {
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
