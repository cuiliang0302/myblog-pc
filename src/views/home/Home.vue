<template>
  <section class="home">
    <NavMenu></NavMenu>
    <div class="page">
      <article v-motion-slide-left :duration="1200">
        <div class="carousel">
          <el-skeleton :loading="carouselLoading" animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 900px; height: 500px"/>
            </template>
            <template #default>
              <el-carousel width="900px" height="500px" :interval="4000" motion-blur>
                <el-carousel-item v-for="carousel in carouselList" :key="carousel.id">
                  <el-image
                      class="pointer"
                      style="width: 900px; height: 500px"
                      :src="carousel.img"
                      :fit="'fill'"
                      :key="carousel.id"
                      @click="toCarousel(carousel.url,carousel.title)"
                  >
                    <template #placeholder>
                      <Loading type="image"></Loading>
                    </template>
                  </el-image>
                </el-carousel-item>
              </el-carousel>
            </template>
          </el-skeleton>
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
            <p class="isLoading" v-if="loading" v-loading="loading"
               element-loading-text="玩命加载中"
               element-loading-background="#ffffff"></p>
            <p v-if="!noMore && article.count">
              <el-divider>我是有底线的</el-divider>
            </p>
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

<script setup name="Home">
import NavMenu from "@/components/common/NavMenu.vue";
import Loading from "@/components/common/Loading.vue"
import ArticleItem from "@/components/common/ArticleItem.vue";
import Aside from "@/components/common/Aside.vue"
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import {computed, onActivated, onMounted, onUnmounted, reactive, ref} from "vue";
import {getCarousel} from "@/api/management";
import {getArticle} from "@/api/blog";
import useStore from "@/store";
const {common} = useStore();
//轮播图
const carouselList = ref([])

async function CarouselData() {
  carouselList.value = await getCarousel()
  console.log(carouselList.value)
}

// 点击轮播图跳转
const toCarousel = (url, title) => {
  console.log(url)
  console.log("umami", window.umami.track)
  console.log("点击轮播图：" + title)
  window.umami.track("点击轮播图：" + title)
  window.open(url)
}
// 加载动画是否开启
const carouselLoading = ref(true)
//最新文章列表
const article = reactive({
  list: [],
  count: '',
})
// 是否还有更多需要加载
const noMore = computed(() => article.list.length < article.count);
// 文章请求参数
const article_params = {
  page: 1,
  size: 5,
  ordering: '-created_time',
}
// 是否可以执行加载中动画
const loading = ref(true)
// 加载中svg
const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `
// 加载下一页
const load = () => {
  getArticle(article_params).then((response) => {
    article.list.push(...response.results)
    article.count = response.count
    loading.value = false
    article_params.page = article_params.page + 1
  })
}
const DISTANCE_TO_LOAD = 600 // 距页面底部多少 px 时提前加载（约一屏高度，避免滚到底才加载）
const onPageScroll = () => {
  if (!noMore.value || loading.value) return
  const { scrollHeight, scrollTop, clientHeight } = document.documentElement
  const distance = scrollHeight - scrollTop - clientHeight
  if (distance <= DISTANCE_TO_LOAD) {
    loading.value = true
    load()
  }
}
onMounted(() => {
  CarouselData()
  load()
  window.addEventListener('scroll', onPageScroll, { passive: true })
  setTimeout(() => {
    carouselLoading.value = false
  }, 2000)
  // 加载umami统计
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://umami.cuiliangblog.cn/script.js';
  script.setAttribute('data-website-id', "148a1e4d-f683-4819-a172-7605346b75e7")
  script.setAttribute('data-auto-track', "false")
  document.body.appendChild(script)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onPageScroll)
})
onActivated(() => {
  common.setMenuIndex('1')
})
</script>

<style scoped lang="scss">
article {
  .carousel {
    background-color: var(--el-bg-color-overlay);
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

  .isLoading {
    padding: 30px;
    font-size: 30px;
  }
}
.box-card {
  :deep(.el-card__body) {
    overflow: hidden;
  }
}
aside {
}
</style>
