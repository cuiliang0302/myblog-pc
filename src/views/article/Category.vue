<template>
  <section class="category">
    <NavMenu></NavMenu>
    <div class="page">
      <article class="animate__animated animate__fadeInLeft">
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

<script setup name="Category">
import NavMenu from "@/components/common/NavMenu.vue";
import ArticleItem from "@/components/common/ArticleItem.vue";
import Aside from "@/components/common/Aside.vue"
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import Pagination from "@/components/common/Pagination.vue"
import {onActivated, onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getArticle, getCategoryName} from "@/api/blog";
import store from "@/store";

const router = useRouter()
// 当前文章分类id
const categoryID = ref()
// 文章分类名
const categoryName = ref('')

// 获取文章分类名称
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

// 获取文章数据
async function articleData(page, size, categoryID) {
  const params = {
    page: page,
    size: size,
    ordering: '-created_time',
    category: categoryID
  }
  let data = await getArticle(params)
  article.list = data.results
  article.count = data.count
  console.log(article.list, article.count)
}

// 分页-页面跳转
const changePage = (pageSize, pageNumber) => {
  console.log("categoryID",categoryID.value)
  window.scrollTo({top: 0})
  console.log(pageSize, pageNumber)
  articleData(pageNumber, pageSize, categoryID.value)
}

onMounted(() => {
  categoryID.value = router.currentRoute.value.params.id
  categoryNameData(categoryID.value)
  articleData(1, 10, categoryID.value)
})
onBeforeRouteUpdate(async (to) => {
  categoryID.value = to.params.id
  await categoryNameData(categoryID.value)
  await articleData(1, 10, categoryID.value)
});
onActivated(() => {
  store.commit('setMenuIndex', '2-'+router.currentRoute.value.params.id)
})
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
