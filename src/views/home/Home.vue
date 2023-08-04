<template>
  <section class="home">
    <NavMenu></NavMenu>
    <div class="page">
      <article class="animate__animated animate__fadeInLeft">
        <div class="carousel">
          <el-skeleton :loading="carouselLoading" animated>
            <template #template>
              <el-skeleton-item variant="image" style="width: 900px; height: 500px"/>
            </template>
            <template #default>
              <el-carousel width="900px" height="500px" :interval="5000">
                <el-carousel-item v-for="carousel in carouselList" :key="carousel.id">
                  <el-image
                      class="pointer"
                      style="width: 900px; height: 500px"
                      :src="carousel.img"
                      :fit="'fill'"
                      :key="carousel.id"
                      @click="toCarousel(carousel.url)"
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
import store from "@/store";
//轮播图
const carouselList = ref([])

async function CarouselData() {
  carouselList.value = await getCarousel()
  console.log(carouselList.value)
}

// 点击轮播图跳转
const toCarousel = (url) => {
  console.log(url)
  console.log("umami", window.umami.track)
  window.umami.track('Signup button');
  // window.open(url)
}
// 轮播图加载动画是否开启
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
  console.log("加载下一页了")
  getArticle(article_params).then((response) => {
    article.list.push(...response.results)
    article.count = response.count
    console.log(response.results)
    loading.value = false;
    article_params.page = article_params.page + 1
  })
}
// 页面滚动事件
const scrollHandle = () => {
  const scrollHeight = document.body.scrollHeight || document.documentElement.scrollHeight
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
  const clientHeight = document.documentElement.clientHeight
  const distance = scrollHeight - scrollTop - clientHeight
  if (distance <= 400 && noMore.value) {
    if (!loading.value) {
      loading.value = true;
      setTimeout(() => {
        load()
      }, 300);
    }
  }
}
onMounted(() => {
  CarouselData()
  load()
  // 监听滚动事件
  window.addEventListener("scroll", scrollHandle, false)
  setTimeout(() => {
    carouselLoading.value = false
  }, 2000)
  // 加载umami统计
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://umami.cuiliangblog.cn/script.js';
  script.setAttribute('data-website-id', "9447ca81-4839-4b2d-a0e3-f795515a2f3b")
  script.setAttribute('data-auto-track', "false")
  document.body.appendChild(script)
  console.log("umami", window.umami.track)
})
onUnmounted(() => {
  // 组件卸载时，停止监听
  window.removeEventListener("scroll", scrollHandle, false)
})
onActivated(() => {
  store.commit('setMenuIndex', '1')
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

aside {
}
</style>
