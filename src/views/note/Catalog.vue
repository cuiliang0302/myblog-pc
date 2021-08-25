<template>
  <NavMenu :activeMenu="'3-'+router.currentRoute.value.params.id"></NavMenu>
  <div class="page">
    <div class="catalog">
      <el-tree :data="catalogList" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup>
import {
  ElTree,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCatalogue} from "@/api/blog";

const router = useRouter()
// 点击跳转笔记详情页
const handleNodeClick = (data) => {
  if (!data.children) {
    router.push({path: `/detail/note/${data.id}`})
  }
}
// 笔记目录列表
const catalogList = ref([])

// 获取笔记目录数据
async function catalogueData(catalogueID) {
  let data = await getCatalogue(catalogueID)
  console.log(data)
  catalogList.value = data.map((i, index) => {
    return {
      id: i['id'],
      label: '第' + (index + 1) + '章：' + i['name'],
      children: i['child'].map((j, index) => {
        return {
          id: j['section_id'],
          label: (index + 1) + '. ' + j['name'],
          children: NaN
        }
      })
    }
  })
}

onMounted(async () => {
  let catalogueID = router.currentRoute.value.params.id
  await catalogueData(catalogueID)
})
onBeforeRouteUpdate(async (to) => {
  console.log(to.params.id)
  await catalogueData(to.params.id)
});
</script>

<style lang="scss">
.catalog {
  padding: 20px 10px;
  background-color: $color-background-white;
}

.el-tree {
  .el-tree-node {
    padding: 10px 0;
  }

  span {
    font-size: 16px !important;
  }
}
</style>
