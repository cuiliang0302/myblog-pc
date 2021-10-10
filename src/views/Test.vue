<template>
  <div class="exceptional">
    <h1>当前章节：{{ sectionID }}</h1>
    <el-button type="primary" @click="last">上一节</el-button>
    <el-button type="success" @click="next">下一节</el-button>
    <div class="catalog">
      <el-tree :data="catalogList" @node-click="handleNodeClick" :default-expanded-keys="expanded"
               :current-node-key="current" node-key="id" :highlight-current="true"></el-tree>
    </div>
  </div>
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
// 当前笔记的id
const sectionID = ref(3)
// 点击跳转笔记详情页
const handleNodeClick = (data) => {
  if (!data.children) {
    router.push({path: `/detail/section/${data.id}`})
  }
}
// 上一节笔记
const last = () => {
  sectionID.value = sectionID.value - 1
}
// 下一节笔记
const next = () => {
  sectionID.value = sectionID.value + 1
}
// 当前笔记展开的目录id
const expanded = ref([1])
// 当前高亮的笔记目录id
const current = ref()
// 笔记目录列表
const catalogList = ref([])

// 获取笔记目录数据
async function catalogueData(catalogueID) {
  let data = await getCatalogue(catalogueID)
  console.log(data)
  catalogList.value = data.map((i, index) => {
    return {
      id: i['id'],
      label: '第' + (index + 1) + '章：' + i['name'] + '【目录ID】:' + i['id'],
      children: i['child'].map((j, index) => {
        return {
          id: j['id'],
          label: (index + 1) + '. ' + j['name'] + '【笔记ID】:' + j['section_id'],
          children: NaN
        }
      })
    }
  })
}

onMounted(async () => {
  let catalogueID = 1
  await catalogueData(catalogueID)
  current.value = 3
})
onBeforeRouteUpdate(async (to) => {
  console.log(to.params.id)
  await catalogueData(to.params.id)
});
</script>

<style scoped lang="scss">
</style>
