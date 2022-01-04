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
        <span @click="otherLogin('QQ')"><MyIcon type="icon-qq-logo" class="logo-icon"/><br>QQ</span>
        <span @click="otherLogin('PAY')"><MyIcon type="icon-alipay-logo" class="logo-icon"/><br>支付宝</span>
        <span @click="otherLogin('BAIDU')"><MyIcon type="icon-baidu-logo" class="logo-icon"/><br>百度</span>
        <span @click="otherLogin('WEIBO')"><MyIcon type="icon-weibo-logo" class="logo-icon"/><br>微博</span>
        <span @click="otherLogin('GITHUB')"><MyIcon type="icon-github-logo" class="logo-icon"/><br>GitHub</span>
        <span @click="otherLogin('MICROSOFT')"><MyIcon type="icon-microsoft-logo" class="logo-icon"/><br>微软</span>
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
import {getOAuthID} from "@/api/account";

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
const otherLogin = (kind) => {
  ElMessage('第三方登录正在调试中，如遇异常请更换其他登录方式！')
  console.log(kind)
  let domain = window.location.protocol + "//" + window.location.host
  if (kind === 'WEIBO') {
    getOAuthID(kind).then((response) => {
      console.log(response)
      let url = 'https://api.weibo.com/oauth2/authorize?client_id=' + response.clientId +
          '&response_type=code&redirect_uri=' + domain + '/OAuth/' + kind
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
  if (kind === 'QQ') {
    getOAuthID(kind).then((response) => {
      console.log(response)
      let url = 'https://graph.qq.com/oauth2.0/authorize?client_id=' + response.clientId +
          '&response_type=code&redirect_uri=' + domain + '/OAuth/' + kind + '&state=' + Math.random().toString(36).slice(-6)
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
  if (kind === 'PAY') {
    getOAuthID(kind).then((response) => {
      console.log(response)
      let url = 'https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=' + response.clientId +
          '&scope=auth_user&redirect_uri=' + domain + '/OAuth/' + kind + '&state=' + Math.random().toString(36).slice(-6)
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
  if (kind === 'GITHUB') {
    getOAuthID(kind).then((response) => {
      console.log(response)
      let url = 'https://github.com/login/oauth/authorize?client_id=' + response.clientId +
          '&scope=user&redirect_uri=' + domain + '/OAuth/' + kind + '&state=' + Math.random().toString(36).slice(-6)
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
  if (kind === 'BAIDU') {
    getOAuthID(kind).then((response) => {
      console.log(response)
      let url = 'https://openapi.baidu.com/oauth/2.0/authorize?client_id=' + response.clientId +
          '&redirect_uri=' + domain + '/OAuth/' + kind + '&response_type=code&state=' + Math.random().toString(36).slice(-6)
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
  if (kind === 'MICROSOFT') {
    getOAuthID(kind).then((response) => {
      console.log(response)
      let url = 'https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=' + response.clientId +
          '&response_type=code&redirect_uri=' + domain + '/OAuth/' + kind +
          '&response_mode=query&scope=offline_access user.read&state=' + Math.random().toString(36).slice(-6)
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
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
      margin: 10px 1%;
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
