<template>
  <el-menu
      default-active="1"
      class="el-menu-vertical-demo"
      :default-openeds="['2','3']"
      @select="changePage"
      :collapse="isCollapse"
      router
  >
    <span class="logo">
      <el-image
          style="width: 40px; height: 40px"
          :src="siteConfig.logo"
          :fit="'fill'"></el-image>
      <span class="no-choose" v-show="isCollapse===false">{{ siteConfig.name }}</span>
    </span>
    <el-menu-item index="1" @click="$router.push('/personal/myIndex')">
      <el-icon><icon-user /></el-icon>
      <span class="menu-icon-text">个人中心</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <operation/>
        </el-icon>
        <span class="menu-icon-text">账号管理</span>
      </template>
      <el-menu-item index="2-1" @click="$router.push('/personal/myInfo')">修改信息</el-menu-item>
      <el-menu-item index="2-2" @click="$router.push('/personal/changePassword')">修改密码</el-menu-item>
      <el-menu-item index="2-3" @click="$router.push('/personal/changeEmail')">更换邮箱</el-menu-item>
      <el-menu-item index="2-4" @click="$router.push('/personal/changePhone')">更换手机</el-menu-item>
      <el-menu-item index="2-5" @click="changeFlow">文章发布邮件通知</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon><tickets /></el-icon>
        <span class="menu-icon-text">我的足迹</span>
      </template>
      <el-menu-item index="3-1" @click="$router.push('/personal/myHistory')">浏览记录</el-menu-item>
      <el-menu-item index="3-2" @click="$router.push('/personal/MyCollect')">收藏记录</el-menu-item>
      <el-menu-item index="3-3" @click="$router.push('/personal/MyComments')">评论记录</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {User as IconUser, Tickets, Operation} from '@element-plus/icons-vue'
import {computed, onMounted, reactive} from "vue";
import {getSiteConfig} from "@/api/management";
import store from "@/store";
import {getUserinfoId} from "@/api/account";
import user from "@/utils/user";
// 引入用户信息模块
// let {userId} = user();
//导航菜单-logo和name
const siteConfig = reactive({
  logo: '',
  name: '',
})
// 获取网站数据
async function siteConfigData() {
  let data = await getSiteConfig()
  siteConfig.logo = data.logo
  siteConfig.name = data.name
}

// 当前激活的id
const asideMenuIndex = computed(() => store.state.asideMenuIndex)
// 点击导航栏切换页面事件
const changePage = (index) => {
  store.commit("setAsideMenuIndex", index)
}
// 个人中心导航栏是否折叠
const isCollapse = computed(() => store.state.asideMenuFold)
// 用户信息
const userInfo = reactive({})
// 获取用户信息
async function getUserinfo() {
  Object.assign(userInfo,await getUserinfoId(userId.value))
}
// 设置是否接收邮件通知
const changeFlow = () => {
  console.log("点了")
  console.log(userInfo)
}
onMounted(() => {
  siteConfigData()
  // getUserinfo()
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
  margin: 10px 0 15px 10px;

  span {
    vertical-align: 15px;
    margin-left: 10px;
  }
}

.menu-icon-text {
  margin-left: 10px;
  vertical-align: -3px;
}
</style>
