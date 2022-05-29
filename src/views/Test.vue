<template>
  <NavMenu></NavMenu>
  <h1>这是测试页</h1>
  <h1 v-text="$route.meta"></h1>
  <h1 v-text="$route.meta.keepAlive"></h1>
</template>
<script setup name="Test">
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
