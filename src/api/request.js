import axios from 'axios'
import {ElMessage} from 'element-plus'
import useStore from "@/store";

const {user} = useStore();
// 存储当前显示的消息
let currentMessage = null;

function showMessage(message) {
  // 如果已经有消息在显示，先关闭它
  console.log(message)
  if (currentMessage) {
    return null
  }
  // 显示新消息并保存引用
  currentMessage = ElMessage.error({
    message: message,
    duration: 3000,  // 可选，控制消息显示的时间
    onClose: () => {  // 可选，消息关闭时清除引用
      currentMessage = null;
    }
  });
}

export function request(config) {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 创建axios的实例
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    timeout: 50000
  })
  // 请求拦截器配置
  instance.interceptors.request.use(config => {
      if (user.token) {
        config.headers.Authorization = 'Bearer ' + user.token
      }
      return config
    }, error => {
      console.log(error)
      return Promise.error(error)
    }
  )
  // 响应拦截器配置
  instance.interceptors.response.use(response => {
    return response.data
  }, async error => {
    console.log(error)
    if (error.response && error.response.data) {
      switch (error.response.status) {
        case 400:
          return Promise.reject(error.response.data)
        case 401:
          console.log("无权访问")
          showMessage('对不起，您的身份信息已过期，需重新登录！')
          localStorage.clear()
          sessionStorage.clear()
          await sleep(2000)
          window.location.href = "/";
          break
        case 403:
          showMessage('对不起，您无权限访问此数据，即将跳转至登录页')
          localStorage.clear()
          sessionStorage.clear()
          await sleep(2000)
          window.location.href = "/loginRegister?component=Login";
          break
        case 404:
          showMessage("接口地址错误，请刷新页面后重试！")
          console.log("404啦")
          break
        case 500:
          showMessage('后端接口异常，请稍候重试！')
          console.log("500啦")
          break
        default:
          return Promise.reject(error)
      }
    } else {
      console.log("请求超时")
      ElMessage.error('请求超时，检查网络状态或刷新重试！')
    }

    return Promise.reject(error)
  })
  // 发送真正的网络请求
  return instance(config);
}

export default request
