<template>
  <NavMenu></NavMenu>
  <div class="page">
    <div class="animate__animated animate__fadeIn">
      <el-collapse v-model="activeNames" expand-icon-position="left" >
        <el-collapse-item v-for="item in about" :key="item.id" :title="item.title" :name="item.id" >
          <MarkDown :text="item.body"></MarkDown>
<!--          {{item.body}}-->
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup name="About">
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import MarkDown from "@/components/detail/MarkDown.vue"
import BackTop from "@/components/common/BackTop.vue"
import {onActivated, onMounted, ref} from "vue";
import {getAbout} from "@/api/management";
import useStore from "@/store";
const {common} = useStore();
// 关于页数据
const about = ref([])

// 获取关于页数据
async function aboutData() {
  about.value = await getAbout()
}

onMounted(() => {
  aboutData()
})
onActivated(() => {
  console.log("执行onActivated")
  common.setMenuIndex('6')
})
// 默认展开的数据
const activeNames = ref([1]);
</script>

<style lang="scss">
.el-collapse-item__title{
  font-size: 25px !important;
  color: var(--el-color-primary) !important;
  margin-left: 0.5em;
}
</style>
