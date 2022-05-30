<template>
  <NavMenu></NavMenu>
  <div class="page" v-title="title+'-笔记目录'">
    <div class="catalog animate__animated animate__zoomIn">
      <el-tree :data="catalogList" @node-click="handleNodeClick"></el-tree>
    </div>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup name="Catalog">
import {
  ElTree,
} from 'element-plus'
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import {onBeforeRouteUpdate, useRouter} from "vue-router";
import {onActivated, onMounted, ref} from "vue";
import {getCatalogueList, getNoteDetail} from "@/api/blog";
import store from "@/store";
const router = useRouter()
// 笔记名称
const title = ref()
// 点击跳转笔记详情页
const handleNodeClick = (data) => {
  if (!data.children) {
    router.push({path: `/detail/section/${data.id}`})
  }
}
// 笔记目录列表
const catalogList = ref([])

// 获取笔记目录数据
async function catalogueData(catalogueID) {
  let data = await getCatalogueList(catalogueID)
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
// 获取笔记名称
async function titleData(catalogueID) {
  let note_data = await getNoteDetail(catalogueID)
  title.value = note_data.name
}
onMounted(async () => {
  let catalogueID = router.currentRoute.value.params.id
  await catalogueData(catalogueID)
  await titleData(catalogueID)
})
onBeforeRouteUpdate(async (to) => {
  console.log(to.params.id)
  await catalogueData(to.params.id)
});
onActivated(() => {
  store.commit('setMenuIndex', '3-'+router.currentRoute.value.params.id)
})
</script>

<style lang="scss">
.catalog {
  padding: 20px 10px;
  background-color: var(--el-bg-color-overlay);

  .el-tree {
    .el-tree-node {
      padding: 10px 0;
    }

    span {
      font-size: 16px !important;
    }
  }
}


</style>
