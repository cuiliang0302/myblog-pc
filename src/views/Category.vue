<template>
  <section class="category">
    <NavMenu :activeMenu="'2-'+router.currentRoute.value.params.id"></NavMenu>
    <div class="page">
      <article>
        <div class="current-position">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>文章分类</el-breadcrumb-item>
            <el-breadcrumb-item>{{ categoryName }}</el-breadcrumb-item>
          </el-breadcrumb>
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
<!--              <el-pagination-->
<!--                  @size-change="handleSizeChange"-->
<!--                  @current-change="handleCurrentChange"-->
<!--                  :current-page="currentPage"-->
<!--                  :page-sizes="[5, 10, 15, 20]"-->
<!--                  :page-size="10"-->
<!--                  layout="total, sizes, prev, pager, next, jumper"-->
<!--                  :total="article.count">-->
<!--              </el-pagination>-->
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
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
  ElCard,
  ElPagination
} from 'element-plus'
import {onMounted, reactive, ref} from "vue";
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {getArticle, getCategoryName} from "@/api/blog";

const router = useRouter()
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

async function articleData(categoryID) {
  let data = await getArticle(1, 20, '-created_time', categoryID, NaN)
  article.list = data.results
  article.count = data.count
  console.log(article.list, article.count)
}

// // 分页-直接前往页
// const currentPage = ref(1)
// // 分页-页码大小改变
// const handleSizeChange = (val) => {
//   console.log(`每页 ${val} 条`);
// };
// // 分页-当前页变动
// const handleCurrentChange = (val) => {
//   console.log(`当前页: ${val}`);
// };
onMounted(() => {
  let categoryID = router.currentRoute.value.params.id
  categoryNameData(categoryID)
  articleData(categoryID)
})
onBeforeRouteUpdate(async (to) => {
  await categoryNameData(to.params.id)
  await articleData(to.params.id)
});
</script>

<style scoped lang="scss">
.category {
  .current-position {
    background-color: $color-background-white;
    padding: 20px
  }

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
      text-align: center;
      margin-top: 40px;
    }
  }
}
</style>
