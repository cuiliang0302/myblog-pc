<template>
  <NavMenu :activeMenu="'6'"></NavMenu>
  <h1>这是测试页</h1>
  <div v-for="item in about" :key="item.id">
    <MarkDown :text="item.body"></MarkDown>
  </div>
  <!--  <MarkDown :text="item.body"></MarkDown>-->
</template>
<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import MarkDown from "@/components/detail/MarkDown.vue"
import {onMounted, ref} from "vue";
import {getAbout} from "@/api/management";
// 关于页数据
const about = ref([])

// 获取关于页数据
async function aboutData() {
  about.value = await getAbout()
}

onMounted(() => {
  aboutData()
})
</script>
<style lang="scss" scoped>
</style>
