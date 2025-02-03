<template>
  <el-menu
      :default-active="asideMenuIndex"
      class="el-menu-vertical-demo"
      :default-openeds="['2','3']"
      :collapse="aside_menu_fold"
  >
    <span class="logo">
      <el-image
          style="width: 40px; height: 40px"
          :src="siteConfig.logo"
          :fit="'fill'"></el-image>
      <span class="no-choose" v-show="aside_menu_fold===false">{{ siteConfig.name }}</span>
    </span>
    <el-menu-item index="/personal/myIndex" @click="route.push('/personal/myIndex')">
      <el-icon>
        <icon-user/>
      </el-icon>
      <span class="menu-icon-text">个人中心</span>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon>
          <operation/>
        </el-icon>
        <span class="menu-icon-text">账号管理</span>
      </template>
      <el-menu-item index="/personal/myInfo" @click="route.push('/personal/myInfo')">修改信息</el-menu-item>
      <el-menu-item index="/personal/changePassword" @click="route.push('/personal/changePassword')">修改密码</el-menu-item>
      <el-menu-item index="/personal/changeEmail" @click="route.push('/personal/changeEmail')">更换邮箱</el-menu-item>
      <el-menu-item index="/personal/changePhone" @click="route.push('/personal/changePhone')">更换手机</el-menu-item>
      <el-menu-item index="flow" @click="changeFlow">订阅更新</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>
        <el-icon>
          <tickets/>
        </el-icon>
        <span class="menu-icon-text">我的足迹</span>
      </template>
      <el-menu-item index="/personal/myHistory" @click="route.push('/personal/myHistory')">浏览记录</el-menu-item>
      <el-menu-item index="/personal/MyCollect" @click="route.push('/personal/MyCollect')">收藏记录</el-menu-item>
      <el-menu-item index="/personal/MyComments" @click="route.push('/personal/MyComments')">评论记录</el-menu-item>
    </el-sub-menu>
  </el-menu>
  <el-dialog
      v-model="flowDialog"
      title="开启订阅"
      width="30%"
  >
    <MyIcon type="icon-question" class="flow-icon"/>
    <span>是否开启文章发布邮件通知？</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="flowClose">关闭</el-button>
        <el-button type="primary" @click="flowOpen">开启</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {User as IconUser, Tickets, Operation} from '@element-plus/icons-vue'
import {computed, onMounted, reactive, ref} from "vue";
import {getSiteConfig} from "@/api/management";
import {getUserinfoId, putUserinfoId} from "@/api/account";
import {useRouter} from "vue-router";
import {ElMessage, ElMessageBox} from "element-plus";
import icon from "@/utils/icon";
const {MyIcon} = icon()
const route = useRouter()
const router = useRouter()
import useStore from "@/store";
import {storeToRefs} from 'pinia'
const {common,user} = useStore();
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
const asideMenuIndex = ref('/personal/myIndex')
// 个人中心导航栏是否折叠
const {aside_menu_fold} = storeToRefs(common)
// 用户信息
const userInfo = reactive({})

// 获取用户信息
async function getUserinfo() {
  Object.assign(userInfo, await getUserinfoId(user.user_id))
}

// 设置是否接收邮件通知
const changeFlow = () => {
  if (userInfo.email.length === 0) {
    ElMessageBox.alert('您的账号未绑定邮箱，请先绑定邮箱后再进行设置！', '绑定邮箱', {
      confirmButtonText: '确定',
      callback: () => {
        router.push('/personal/changeEmail')
      },
    })
  } else {
    flowDialog.value = true
  }
}
// 是否开启订阅弹窗
const flowDialog = ref(false)
// 订阅弹窗开启事件
const flowOpen = () => {
  console.log("点了开启了")
  userInfo.is_flow = true
  putUserinfoId(user.user_id, userInfo).then((response) => {
    console.log(response)
    ElMessage({
      message: '已开启新文章发布邮件通知！',
      type: 'success',
    })
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('开启新文章发布邮件通知失败！')
  });
  flowDialog.value = false
}
// 订阅弹窗关闭事件
const flowClose = () => {
  console.log("点了关闭了")
  userInfo.is_flow = false
  putUserinfoId(user.user_id, userInfo).then((response) => {
    console.log(response)
    ElMessage({
      message: '已取消新文章发布邮件通知！',
      type: 'success',
    })
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('取消新文章发布邮件通知失败！')
  });
  flowDialog.value = false
}
onMounted(() => {
  asideMenuIndex.value = route.currentRoute.value.fullPath
  siteConfigData()
  getUserinfo()
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
.flow-icon{
  font-size: 30px;
  margin-right: 5px;
  vertical-align: -10px;
}
</style>
