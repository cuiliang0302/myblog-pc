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
                  :fit="'fill'">
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
            <ul>
              <li v-for="item in article.list" :key="item.id">
                <ArticleItem :article="item"></ArticleItem>
              </li>
            </ul>
          </el-card>
        </div>
      </article>
      <aside>
        这是侧边栏
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
  ElButton,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Loading from "@/components/common/Loading.vue"
import ArticleItem from "@/components/common/ArticleItem.vue";
import {onMounted, reactive, ref} from "vue";
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

async function articleData() {
  let data = await getArticle()
  article.list = data.results
  article.count = data.count
  console.log(article.list, article.count)
}

onMounted(() => {
  CarouselData()
  articleData()
})
</script>

<style scoped lang="scss">
article {
  .carousel {
    background-color: $color-background-white;
  }

  .new {
    margin-top: 15px;

    .card-title {
      color: $color-primary;
      font-size: 25px;
    }

    ul {
      list-style-type: none;
      padding: 0;

      li {
      }
    }
  }
}

aside {
}
</style>
