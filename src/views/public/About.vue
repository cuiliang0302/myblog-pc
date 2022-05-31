<template>
  <NavMenu></NavMenu>
  <div class="page">
    <div>
      <el-collapse v-model="activeNames">
        <el-collapse-item v-for="item in about" :key="item.id" :title="item.title" :name="item.id">
          <MarkDown :text="item.body"></MarkDown>
        </el-collapse-item>
      </el-collapse>
    </div>
    {{isDark}}
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup name="About">
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import MarkDown from "@/components/detail/MarkDown.vue"
import BackTop from "@/components/common/BackTop.vue"
import {onActivated, onMounted, ref, watch} from "vue";
import {getAbout} from "@/api/management";
import store from "@/store";
import dark from "@/utils/dark";
// 关于页数据
const about = ref([])
let {isDark} = dark()
// 获取关于页数据
async function aboutData() {
  about.value = await getAbout()
}
watch(() => isDark.value, (newVal, oldVal) => {
  console.log('About-watch',newVal, oldVal)
  // debugger
  console.log("换颜色了啊")
})
onMounted(() => {
  aboutData()
})
onActivated(() => {
  store.commit('setMenuIndex', '6')
})
// 默认展开的数据
const activeNames = ref([1]);
</script>

<style lang="scss">
.el-collapse-item__header {
  font-size: 25px !important;
  color: var(--el-color-primary) !important;
  padding-left: 1em;
}
</style>
