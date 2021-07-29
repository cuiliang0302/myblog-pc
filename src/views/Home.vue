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
            aaaaaaaaaaaaaa
<!--            <ul class="infinite-list" v-infinite-scroll="load" style="overflow:auto">-->
<!--              <li v-for="i in count" class="infinite-list-item">{{ i }}</li>-->
<!--            </ul>-->
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
import {onMounted, ref} from "vue";
import {getCarousel} from "@/api/management";
//轮播图
const carouselList = ref([])

async function CarouselData() {
  carouselList.value = await getCarousel()
  console.log(carouselList.value)
}
const count = ref(0);
const load = () => {
  count.value += 2;
};
onMounted(() => {
  CarouselData()
})
</script>

<style scoped lang="scss">
article {
  .carousel {
    background-color: $color-background-white;
  }

  .new {
    margin-top: 15px;
    .card-title{
      color: $color-primary;
      font-size: 25px;
    }

  }
}

aside {
}
</style>
