<template>
  <section class="home">
    <NavMenu></NavMenu>
    <div class="page">
      <article>
        <div class="carousel">
          <el-carousel height="500px">
            <el-carousel-item v-for="carousel in carouselList" :key="carousel.id">
              <el-image
                  style="width: 900px; height: 500px"
                  :src="carousel.img"
                  :fit="'fill'"
                  lazy>
                <template #placeholder>
                  <Loading></Loading>
                </template>
              </el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="new">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span class="card-title">🆕 最新文章</span>
              </div>
            </template>
            <ul v-infinite-scroll="load"
                infinite-scroll-disabled="disabled">
              <li v-for="item in article.list" :key="item.id">
                <ArticleItem :article="item"></ArticleItem>
              </li>
            </ul>
            <p v-if="loading" v-loading="loading"
               element-loading-text="玩命加载中"
               element-loading-spinner="el-icon-loading"
               element-loading-background="#ffffff"></p>
            <p v-if="noMore">
              <el-divider>我是有底线的</el-divider>
            </p>
          </el-card>
        </div>
      </article>
      <aside>
        <Aside></Aside>
      </aside>
    </div>
  </section>
</template>

<script setup>
import {
  ElCarousel,
  ElCarouselItem,
  ElImage,
  ElCard,
  ElDivider,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Loading from "@/components/common/Loading.vue"
import ArticleItem from "@/components/common/ArticleItem.vue";
import Aside from "@/components/common/Aside.vue"
import {computed, onMounted, reactive, ref} from "vue";
import {getCarousel} from "@/api/management";
import {getArticle} from "@/api/blog";

//轮播图
const carouselList = ref([])

async function CarouselData() {
  carouselList.value = await getCarousel()
  console.log(carouselList.value)
}

//最新文章列表
const article = reactive({
  list: [],
  count: '',
})

async function articleData(page, order) {
  let data = await getArticle(page, order)
  article.list = data.results
  article.count = data.count
  console.log(article.list, article.count)
}

// 无限滚动
const count = ref(0)
const page = ref(1)
const loading = ref(false);
const noMore = computed(() => count.value >= article.count);
const disabled = computed(() => loading.value || noMore.value);
const load = () => {
  page.value++
  loading.value = true;
  getArticle(page.value, '-created_time').then((response) => {
    article.list.push(...response.results)
    count.value = article.list.length;
    loading.value = false;
  })
};
onMounted(() => {
  CarouselData()
  articleData(page.value, '-created_time')
})
</script>

<style scoped lang="scss">
article {
  .carousel {
    background-color: $color-background-white;
  }

  .new {
    margin-top: 15px;

    ul {
      list-style-type: none;
      padding: 0;
      margin: 0;

      li {
      }
    }
  }
}

aside {
}
</style>
