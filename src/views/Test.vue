<template>
  <h1>这是测试页</h1>
  <div class="carousel">
    <el-skeleton :loading="loading" animated>
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
</template>
<script setup name="Test">
import {nextTick, onMounted, ref} from "vue";
import {getCarousel} from "@/api/management";
//轮播图
const carouselList = ref([])

async function CarouselData() {
  carouselList.value = await getCarousel()
  console.log(carouselList.value)

}

const loading = ref(true)
onMounted(() => {
  CarouselData()
  setTimeout(() => {
    loading.value = false
  }, 5000)
})
</script>
<style scoped lang="scss">
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.carousel {
  width: 900px;
}
</style>
