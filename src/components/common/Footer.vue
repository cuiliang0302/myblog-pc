<template>
  <div class="fixed">
    <footer>
      <el-breadcrumb separator="|">
        <el-breadcrumb-item>{{ footerData.copyright }}</el-breadcrumb-item>
        <el-breadcrumb-item><a :href="footerData.icp_url">{{ footerData.icp_num }}</a></el-breadcrumb-item>
        <el-breadcrumb-item><a :href="footerData.police_url">{{ footerData.police_num }}</a></el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/link' }">友情链接</el-breadcrumb-item>
        <el-breadcrumb-item><a :href="footerData.sitemap">网站地图</a></el-breadcrumb-item>
        <el-breadcrumb-item>Powered By Django REST Framework + Vue</el-breadcrumb-item>
      </el-breadcrumb>
    </footer>
  </div>
</template>

<script setup>
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
} from 'element-plus'
import {nextTick, onMounted, reactive} from "vue";
import {getSiteConfig} from "@/api/management";
// const props = defineProps({
//   // 友情链接类型标题
//   isFixed: {
//     type: String,
//     required: true,
//     default: ''
//   }
// })
const footerData = reactive({
  copyright: '',
  icp_num: '',
  icp_url: '',
  police_num: '',
  police_url: '',
  sitemap: ''
})

async function siteConfigData() {
  let data = await getSiteConfig()
  console.log(data)
  footerData.copyright = data.copyright
  footerData.icp_num = data.icp_num
  footerData.icp_url = data.icp_url
  footerData.police_num = data.police_num
  footerData.police_url = data.police_url
  footerData.sitemap = data.sitemap
  console.log(footerData)
}

onMounted(() => {
  siteConfigData()
})
</script>

<style scoped lang="scss">
//.fixed{
//  position: fixed;
//  width: 100%;
//  bottom: 0;
//}
footer {
  border-top: 1px solid var(--el-border-color-base);
  width: 100%;
  background-color: var(--el-color-white);
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
