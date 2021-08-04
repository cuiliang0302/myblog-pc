<template>
  <footer>
    <el-breadcrumb separator="|">
      <el-breadcrumb-item>{{ footerData.copyright }}</el-breadcrumb-item>
      <el-breadcrumb-item><a :href="footerData.icp_url">{{ footerData.icp_num }}</a></el-breadcrumb-item>
      <el-breadcrumb-item><a :href="footerData.police_url">{{ footerData.police_num }}</a></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/' }">友情链接</el-breadcrumb-item>
      <el-breadcrumb-item>Powered By Django REST framework + Vue</el-breadcrumb-item>
    </el-breadcrumb>
  </footer>
</template>

<script setup>
import {
  ElBreadcrumb,
  ElBreadcrumbItem,
} from 'element-plus'
import {onMounted, reactive} from "vue";
import {getSiteConfig} from "@/api/management";

const footerData = reactive({
  copyright: '',
  icp_num: '',
  icp_url: '',
  police_num: '',
  police_url: ''
})

async function siteConfigData() {
  let data = await getSiteConfig()
  footerData.copyright = data.copyright
  footerData.icp_num = data.icp_num
  footerData.icp_url = data.icp_url
  footerData.police_num = data.police_num
  footerData.police_url = data.police_url
  console.log(footerData)
}

onMounted(() => {
  siteConfigData()
})
</script>

<style scoped lang="scss">
footer {
  border-top: 1px solid #DCDFE6;
  width: 100%;
  background-color: $color-background-white;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
