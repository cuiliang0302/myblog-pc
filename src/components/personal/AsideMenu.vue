<template>
  <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :default-openeds="['2','3']"
  >
    <span class="logo">
      <el-image
          style="width: 40px; height: 40px"
          :src="siteConfig.logo"
          :fit="'fill'"></el-image>
      <span class="no-choose">{{ siteConfig.name }}</span>
    </span>
    <el-menu-item index="1">
      <MyIcon class="icon" type="icon-my"/>
      <span>个人中心</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <MyIcon class="icon" type="icon-user-setting"/>
        <span>账号管理</span>
      </template>
      <el-menu-item index="2-1">修改信息</el-menu-item>
      <el-menu-item index="2-2">修改密码</el-menu-item>
      <el-menu-item index="2-3">更换邮箱</el-menu-item>
      <el-menu-item index="2-4">更换手机</el-menu-item>
      <el-menu-item index="2-5">绑定第三方账号</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <MyIcon class="icon" type="icon-history"/>
        <span>我的足迹</span>
      </template>
      <el-menu-item index="3-1">浏览记录</el-menu-item>
      <el-menu-item index="3-2">收藏记录</el-menu-item>
      <el-menu-item index="3-3">评论记录</el-menu-item>
      <el-menu-item index="3-4">留言记录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import icon from "@/utils/icon";
import {onMounted, reactive} from "vue";
import {getSiteConfig} from "@/api/management";

let {MyIcon} = icon()
//导航菜单-logo和name
const siteConfig = reactive({
  logo: '',
  name: '',
})

async function siteConfigData() {
  let data = await getSiteConfig()
  siteConfig.logo = data.logo
  siteConfig.name = data.name
  // console.log(siteConfig)
}

onMounted(() => {
  siteConfigData()
})
</script>

<style scoped lang="scss">
.el-menu {
  height: 100%;
}

.icon {
  font-size: 18px;
  margin-right: 5px;
}
.logo{
  display: inline-block;
  margin: 10px 0 15px 20px;
  span{
    vertical-align: 15px;
    margin-left: 10px;
  }
}
</style>
