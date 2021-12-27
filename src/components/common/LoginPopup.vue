<template>
  <el-dialog
      v-model="popupIsShow"
      width="50%"
  >
    <div class="login-popup">
      <el-divider>
        <p class="login-info">3秒快捷登录，解锁全部功能</p>
      </el-divider>
      <div class="login-logo">
        <span @click="otherLogin"><MyIcon class="logo-icon" type="icon-qq-logo"/><br>QQ登录</span>
        <span @click="otherLogin"><MyIcon class="logo-icon" type="icon-weibo-logo"/><br>微博登录</span>
        <span @click="otherLogin"><MyIcon class="logo-icon" type="icon-github-logo"/><br>GitHub登录</span>
        <span @click="otherLogin"><MyIcon class="logo-icon" type="icon-baidu-logo"/><br>百度登录</span>
        <span @click="otherLogin"><MyIcon class="logo-icon" type="icon-alipay-logo"/><br>支付宝登录</span>
      </div>
      <div class="login-other">
        <el-link class="login" type="info" @click="toLogin">手机/邮箱/账号登录</el-link>
        <el-link class="register" type="info" @click="toRegister">没有账号？立即注册</el-link>
      </div>
    </div>
    <template #title>
      <div class="login-title">
        <el-avatar
            :src=siteConfig.logo
        ></el-avatar>
        <p>{{ siteConfig.name }}</p>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import {ElMessage} from 'element-plus'
import icon from '@/utils/icon'
import {onMounted, reactive, ref} from "vue";
import {getSiteConfig} from "@/api/management";
import {useRouter} from "vue-router";

const router = useRouter()
let {MyIcon} = icon()
// 登录弹窗默认关闭
const popupIsShow = ref(false)
// 显示登录提示弹窗
const showPopup = () => {
  popupIsShow.value = true;
};
//网站logo和name
const siteConfig = reactive({
  logo: '',
  name: '',
})

async function getSiteConfigData() {
  let data = await getSiteConfig()
  siteConfig.logo = data.logo
  siteConfig.name = data.name
  console.log("siteConfig:", siteConfig)
}

// 跳转至登录页
const toLogin = () => {
  router.push({path: '/loginRegister', query: {component: 'Login'}})
  popupIsShow.value = false
}
// 跳转至注册页
const toRegister = () => {
  router.push({path: '/loginRegister', query: {component: 'Register'}})
  popupIsShow.value = false
}
// 第三方登录
const otherLogin = () => {
  ElMessage('第三方登录功能正在开发中！')
}
onMounted(() => {
  getSiteConfigData()
})
defineExpose({
  showPopup
})
</script>

<style scoped lang="scss">
.login-title {
  display: flex;
  align-items: center;
  justify-content: center;

  p {
    margin-left: 10px;
    font-size: 20px;
  }
}

.login-popup {
  .login-info {
    text-align: center;
    color: $color-text-regular;
  }

  .login-logo {
    display: flex;
    justify-content: center;

    span {
      text-align: center;
      margin: 10px 3%;
      cursor: pointer;
    }

    .logo-icon {
      font-size: 100px;
    }
  }

  .login-other {
    padding: 0 15px;
    margin-top: 40px;
    color: $color-text-secondary;

    .login {

    }

    .register {
      float: right;
    }
  }
}
</style>
