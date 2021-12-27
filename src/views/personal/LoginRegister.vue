<template>
  <div class="login-register">
    <div :class="(component==='Login'?'':'right-panel-active') + ' container animate__animated animate__zoomIn'">
      <div class="form-container sign-up-container">
        <div>
          <h1>用户注册</h1>
          <el-form class="registerForm" ref="registerRef" :model="registerForm" label-width="0" :rules="registerRules">
            <el-form-item prop="username">
              <el-input v-model="registerForm.username" placeholder="请输入用户名">
                <template #prefix>
                  <MyIcon type="icon-my"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="contact">
              <el-input v-model="registerForm.contact" placeholder="请输入邮箱号/手机号">
                <template #prefix>
                  <MyIcon type="icon-email"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input v-model="registerForm.code" placeholder="请输入验证码">
                <template #prefix>
                  <MyIcon type="icon-code"/>
                </template>
                <template #suffix>
                  <VerifyCodeBtn :btnDisabled="codeBtnDisabled" @pass="registerPass"></VerifyCodeBtn>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password1">
              <el-input v-model="registerForm.password1" type="password" placeholder="请输入密码(数字+字符,8-16位)" show-password>
                <template #prefix>
                  <MyIcon type="icon-password"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password2">
              <el-input v-model="registerForm.password2" type="password" placeholder="请再次输入密码" show-password>
                <template #prefix>
                  <MyIcon type="icon-password"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="registerSubmit" round>立即注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container sign-in-container">
        <div>
          <h1>用户登录</h1>
          <el-form class="loginForm" :model="loginForm" ref="loginRef" label-width="0" :rules="loginRules">
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" placeholder="请输入用户名/手机号/邮箱号">
                <template #prefix>
                  <MyIcon type="icon-my"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password>
                <template #prefix>
                  <MyIcon type="icon-password"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <VerifyImgBtn :isPassing="isPassing" @verifyPass="verifyPass" :btnType="btnType"></VerifyImgBtn>
            </el-form-item>
            <el-form-item class="login-setting">
              <span class="remember"><el-checkbox v-model="remember" label="记住密码"></el-checkbox></span>
              <span class="forget pointer" @click="router.push('/setPassword')">忘记密码</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginSubmit" round>立即登录</el-button>
            </el-form-item>
          </el-form>
          <div class="other-login">
            <el-divider>
              <span>第三方账号登录</span>
            </el-divider>
            <div class="other-logo">
              <span @click="otherLogin('QQ')" class="pointer"><MyIcon type="icon-qq-logo"/></span>
              <span @click="otherLogin('WEIBO')" class="pointer"><MyIcon type="icon-weibo-logo"/></span>
              <span @click="otherLogin('GITHUB')" class="pointer"><MyIcon type="icon-github-logo"/></span>
              <span @click="otherLogin('GITHUB')" class="pointer"><MyIcon type="icon-baidu-logo"/></span>
              <span @click="otherLogin('GITHUB')" class="pointer"><MyIcon type="icon-alipay-logo"/></span>
            </div>
          </div>
        </div>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <div class="point">
              <h1>欢迎回来</h1>
              <p>欢迎登录，与我们保持联系。<br>若您已有账号，请立即登录</p>
              <el-button @click="switchLogin" type="danger">切换登录</el-button>
            </div>
          </div>
          <div class="overlay-panel overlay-right">
            <div class="point">
              <h1>欢迎光临</h1>
              <p>欢迎访问{{ sitename }}，并与我们一起开始旅程<br>若您还没有账号，请立即注册</p>
              <el-button @click="switchRegister" type="danger">切换注册</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import icon from '@/utils/icon'
import {onBeforeMount, onMounted, reactive, ref} from "vue";
import {getBgiUrl} from "@/api/public";
import {useRouter} from "vue-router";
import VerifyImgBtn from "@/components/verify/VerifyImgBtn.vue";
import VerifyCodeBtn from "@/components/verify/VerifyCodeBtn.vue"
import {ElMessage} from 'element-plus'
import {getOAuthID, getRegister, postCode, postLogin, postRegister} from "@/api/account";
import store from "@/store";
import {getSiteConfig} from "@/api/management";

const router = useRouter();
let {MyIcon} = icon()
// 引入公共模块
let {switchLogin, switchRegister, bgiURL, component, sitename} = publicFn()
// 引入登录模块
let {loginForm, loginRules, remember, isPassing, verifyPass, btnType, otherLogin} = loginFn()
// 引入注册模块
let {registerForm, registerRules, codeBtnDisabled, registerPass} = registerFn()
// 登录表单对象
const loginRef = ref(null)
// 登录表单提交事件
const loginSubmit = () => {
  loginRef.value.validate((valid) => {
    if (valid && isPassing.value) {
      postLogin(loginForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '登录成功！',
          type: 'success',
        })
        if (remember.value) {
          console.log('记住了')
          store.commit('setKeepLogin', true)
          store.commit('setUserLocal', response)
        } else {
          console.log('记不住')
          store.commit('setKeepLogin', false)
          store.commit('setUserSession', response)
        }
        router.push(store.state.nextPath)
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage.error('账号或密码错误！')
        loginForm.username = ''
        loginForm.password = ''
        isPassing.value = false
      });
    } else {
      console.log("滑块验证了吗")
      btnType.value = 'danger'
      ElMessage.error('请检查表单内容后再登录')
      return false
    }
  })
}
// 注册表单对象
const registerRef = ref(null)
// 注册表单提交事件
const registerSubmit = () => {
  console.log("注册了啊")
  registerRef.value.validate((valid) => {
    if (valid) {
      console.log("表单校验通过了")
      registerForm.password = registerForm.password1
      postRegister(registerForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '注册成功,即将自动登录',
          type: 'success',
        })
        loginForm.username = registerForm.username
        loginForm.password = registerForm.password
        postLogin(loginForm).then((response) => {
          console.log(response)
          store.commit('setKeepLogin', false)
          store.commit('setUserSession', response)
          router.push(store.state.nextPath)
        }).catch(response => {
          //发生错误时执行的代码
          console.log(response)
          ElMessage.error('自动登录出现异常，请重试！')
        });
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage.error('账号注册失败！')
      });
    } else {
      ElMessage.error('请检查表单内容后再登录')
      return false
    }
  })
}

// 公共模块
function publicFn() {
  // 背景图片地址
  const bgiURL = ref('')
  // 当前组件名称
  const component = ref('Login')

  // 获取背景图片
  async function getBgiURLData() {
    const {url} = await getBgiUrl()
    bgiURL.value = 'url(' + url + ')'
  }

  // 站点名称
  const sitename = ref('')

  // 获取站点名称
  async function getSiteConfigData() {
    let siteConfig_data = await getSiteConfig()
    sitename.value = siteConfig_data.name
  }

  // 切换登录页事件
  const switchLogin = () => {
    console.log("切换登录")
    component.value = 'Login'
  }
  // 切换注册页事件
  const switchRegister = () => {
    console.log("切换注册")
    component.value = 'Register'
  }
  onBeforeMount(() => {
    getBgiURLData()
    getSiteConfigData()
  })
  // 其他页面调用，默认跳转
  onMounted(() => {
    if (router.currentRoute.value.query.component) {
      component.value = router.currentRoute.value.query.component
    }
  })
  return {switchLogin, switchRegister, bgiURL, component, sitename}
}

// 登录模块
function loginFn() {
  // 登录表单
  const loginForm = reactive({
    username: '',
    password: ''
  })
  // 登录表单验证规则
  const loginRules = {
    username: [{
      required: true,
      message: '请输入用户名/邮箱号/手机号',
      trigger: 'blur',
    }],
    password: [{
      required: true,
      message: '请输入密码',
      trigger: 'blur',
    }]
  }
  // 是否记住密码
  const remember = ref(false)
  // 滑块验证是否通过
  const isPassing = ref(false)
  // 滑块验证按钮样式
  const btnType = ref('default')
  // 滑块验证通过事件
  const verifyPass = () => {
    console.log("验证通过了")
    isPassing.value = true
  }
  // 第三方登录
  const otherLogin = (kind) => {
    ElMessage('第三方登录正在开发中！')
    console.log(kind)
    getOAuthID(kind).then((response) => {
      console.log(response)
      let domain = window.location.protocol + "//" + window.location.host
      let url = 'https://api.weibo.com/oauth2/authorize?client_id=' + response.clientId +
          '&response_type=code&redirect_uri=' + domain + '/OAuth_pc/' + kind
      console.log(url)
      window.location.href = url;
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error('获取第三方登录ID失败！')
    });
  }
  return {loginForm, remember, isPassing, verifyPass, btnType, otherLogin, loginRules}
}

// 注册模块
function registerFn() {
  // 注册表单
  const registerForm = reactive({
    username: '',
    contact: '',
    code: '',
    password: '',
    password1: '',
    password2: ''
  })
  // 用户名验证
  const checkUsername = (rule, value, callback) => {
    console.log(value)
    if (!value) {
      return callback(new Error('请输入用户名'))
    }
    setTimeout(() => {
      getRegister(value, NaN).then((response) => {
        console.log(response)
        console.log("用户名可以使用")
        callback()
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage({
          message: '用户名已存在，请更换用户名或找回密码',
          type: 'warning',
        })
        callback(new Error('用户名已存在'))
      });
    }, 500)
  }
  // 联系方式验证
  const checkContact = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入邮箱号/手机号'))
    }
    setTimeout(() => {
      getRegister(NaN, value).then((response) => {
        console.log(response)
        console.log("联系方式可以使用")
        codeBtnDisabled.value = false
        callback()
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage({
          message: response.msg + ',请更换联系方式',
          type: 'warning',
        })
        callback(new Error(response.msg))
      });
    }, 500)
  }
  // 用户密码验证
  const checkPassword1 = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入密码'))
    }
    setTimeout(() => {
      registerForm.password1 = value
      const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
      if (!pattern.test(value)) {
        console.log("没通过")
        callback(new Error('密码不符合安全要求！'))
      } else {
        console.log("通过了")
        callback()
      }
    }, 500)
  }
  // 用户确认密码验证
  const checkPassword2 = (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请再次输入密码'))
    }
    setTimeout(() => {
      registerForm.password2 = value
      const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
      if (!pattern.test(value)) {
        console.log("没通过")
        callback(new Error('密码不符合安全要求！'))
      } else {
        if (registerForm.password1 !== registerForm.password2) {
          callback(new Error('两次密码不一致'))
        } else {
          callback()
        }
      }
    }, 500)
  }
  // 注册表单验证规则
  const registerRules = {
    username: [{validator: checkUsername, trigger: 'blur'}],
    contact: [{validator: checkContact, trigger: 'blur'}],
    code: [{required: true, message: '请输入验证码', trigger: 'blur',}],
    password1: [{validator: checkPassword1, trigger: 'blur'}],
    password2: [{validator: checkPassword2, trigger: 'blur'}]
  }
  // 获取验证码表单
  const codeForm = reactive({
    contact: '',
    action: '用户注册',
    username: '新用户',
  })
  // 获取验证码按钮默认状态
  const codeBtnDisabled = ref(true)
  // 获取注册验证码通过事件
  const registerPass = () => {
    console.log("通过验证了,开始获取验证码")
    codeForm.contact = registerForm.contact
    postCode(codeForm).then((response) => {
      console.log(response)
      ElMessage({
        message: '验证码发送成功！',
        type: 'success',
      })
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      ElMessage.error(response.msg)
    });
  }
  return {registerForm, codeBtnDisabled, registerRules, registerPass}
}
</script>

<style scoped lang="scss">
.login-register {
  width: 100vw;
  height: 100vh;
  display: block;
  position: relative;

  .container {
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: absolute;
    overflow: hidden;
    width: 768px;
    max-width: 100%;
    min-height: 520px;
    opacity: 0.9;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;

    .form-container {
      position: absolute;
      top: 0;
      height: 100%;
      transition: all 0.6s ease-in-out;

      > div {
        background: rgba(45, 52, 54, 1.0);
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;

        h1 {
          color: $color-primary;
          margin-bottom: 30px;
        }

        .loginForm {
          width: 300px;

          .login-setting {
            color: $color-text-placeholder;

            .remember {
              float: left;

              .el-checkbox {
                color: $color-text-placeholder;
              }
            }

            .forget {
              float: right;
            }
          }
        }

        .other-login {
          display: contents;

          .el-divider {
            background-color: $color-border-base;
          }

          .other-logo {
            span {
              font-size: 35px;
              margin: 0 10px;
              opacity: 1;
            }
          }
        }

        .registerForm {
          width: 300px;
        }
      }

    }

    .sign-in-container {
      left: 0;
      width: 50%;
      z-index: 2;
    }

    .sign-up-container {
      left: 0;
      width: 50%;
      z-index: 1;
      opacity: 0;
    }

    .overlay-container {
      position: absolute;
      top: 0;
      left: 50%;
      width: 50%;
      height: 100%;
      overflow: hidden;
      transition: transform 0.6s ease-in-out;
      z-index: 100;
    }

    .point {
      h1 {
        margin-bottom: 30px;
        color: white;
        opacity: 1;
      }

      p {
        margin-bottom: 50px;
        line-height: 30px;
        padding: 10px;
        font-weight: bolder;
        font-size: 18px;
      }
    }
  }
}

.login-register::after {
  content: "";
  background-image: v-bind('bgiURL');
  opacity: 0.9;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
  filter: blur(1px);
}


.overlay {
  background: transparent;
  color: #fff;
  position: absolute;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;

  .overlay-panel {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 50%;
    text-align: center;
    transform: translateX(0);
    transition: transform 0.6s ease-in-out;
  }

  .overlay-right {
    right: 0;
    transform: translateX(0);
    background-color: rgba(255, 255, 255, 0.5);
  }

  .overlay-left {
    transform: translateX(0);
    background-color: rgba(255, 255, 255, 0.5);
  }
}


.container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

/*....Move overlay to the left....*/
.container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

/*....Bring sign up over sign in....*/
.container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
}

/*...Move overlay back to right....*/
.container.right-panel-active .overlay {
  transform: translateX(50%);
}

.container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.container.right-panel-active .overlay-right {
  transform: translateX(0);
}

</style>
