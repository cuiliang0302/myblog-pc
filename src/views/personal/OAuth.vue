<template>
  <Loading :type="'tips'" :text="'正在调用'+platform_name+'平台登录，请稍候……'"/>
</template>

<script setup>
import {useRouter} from "vue-router";
import {ElMessage} from 'element-plus'
import {onMounted, reactive, ref} from "vue";
import {postOAuthCallback} from "@/api/account";
import Loading from "@/components/common/Loading.vue"
import store from "@/store";

const router = useRouter()
// 平台名称
const platform_name = ref('')
// 回调登录表单
const OAuthForm = reactive({
  platform: '',
  kind: 'PC',
  code: '',
  redirect_uri: ''
})
// 向后端发送登录回调请求
const postCallback = () => {
  postOAuthCallback(OAuthForm).then((response) => {
    console.log(response)
    ElMessage({
      message: '登录成功！',
      type: 'success',
    })
    store.commit('setKeepLogin', false)
    store.commit('setUserSession', response)
    console.log(store.state.nextPath)
    router.push(store.state.nextPath)
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error('自动登录出现异常，请重试！')
    router.push('/loginRegister')
  });
}
ref('')
onMounted(() => {
  OAuthForm.platform = router.currentRoute.value.params.platform
  OAuthForm.redirect_uri = window.location.protocol + "//" + window.location.host + router.currentRoute.value.path
  if (OAuthForm.platform==='PAY'){
    OAuthForm.code = router.currentRoute.value.query.auth_code
  }else {
    OAuthForm.code = router.currentRoute.value.query.code
  }
  console.log(OAuthForm)
  switch (OAuthForm.platform) {
    case 'WEIBO':
      platform_name.value = '新浪微博'
      break;
    case 'QQ':
      platform_name.value = '腾讯QQ'
      break;
    case 'PAY':
      platform_name.value = '支付宝'
      break;
    case 'GITHUB':
      platform_name.value = 'GitHub'
      break;
    case 'BAIDU':
      platform_name.value = '百度'
      break;
    default:
      platform_name.value = '第三方'
  }
  postCallback()
})
</script>

<style scoped>

</style>
