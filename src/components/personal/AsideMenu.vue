<template>
  <el-menu
      :default-active="asideMenuIndex"
      class="el-menu-vertical-demo"
      :default-openeds="['2','3']"
      @select="changePage"
  >
    <span class="logo">
      <el-image
          style="width: 40px; height: 40px"
          :src="siteConfig.logo"
          :fit="'fill'"></el-image>
      <span class="no-choose">{{ siteConfig.name }}</span>
    </span>
    <el-menu-item index="1" @click="$router.push('/personal/myIndex')">
      <MyIcon class="icon" type="icon-my"/>
      <span>个人中心</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <MyIcon class="icon" type="icon-user-setting"/>
        <span>账号管理</span>
      </template>
      <el-menu-item index="2-1" @click="$router.push('/personal/myInfo')">修改信息</el-menu-item>
      <el-menu-item index="2-2" @click="$router.push('/personal/changePassword')">修改密码</el-menu-item>
      <el-menu-item index="2-3" @click="$router.push('/personal/changeEmail')">更换邮箱</el-menu-item>
      <el-menu-item index="2-4" @click="$router.push('/personal/changePhone')">更换手机</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <MyIcon class="icon" type="icon-history"/>
        <span>我的足迹</span>
      </template>
      <el-menu-item index="3-1" @click="$router.push('/personal/myHistory')">浏览记录</el-menu-item>
      <el-menu-item index="3-2" @click="$router.push('/personal/MyCollect')">收藏记录</el-menu-item>
      <el-menu-item index="3-3" @click="$router.push('/personal/MyComments')">评论记录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import icon from "@/utils/icon";
import {computed, onMounted, reactive} from "vue";
import {getSiteConfig} from "@/api/management";
import store from "@/store";

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
}

// 当前激活的id
const asideMenuIndex = computed(() => store.state.asideMenuIndex)
// 大纲是否显示
// 点击导航栏切换页面事件
const changePage = (index) => {
  store.commit("setAsideMenuIndex", index)
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

.logo {
  display: inline-block;
  margin: 10px 0 15px 20px;

  span {
    vertical-align: 15px;
    margin-left: 10px;
  }
}
</style>
