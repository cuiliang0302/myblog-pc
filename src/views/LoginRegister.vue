<template>
  <div class="login-register">
    <div :class="(component==='Login'?'':'right-panel-active') + ' container'">
      <div class="form-container sign-up-container">
        <div>
          <h1>用户注册</h1>
          <el-form class="registerForm" :model="registerForm" label-width="0">
            <el-form-item>
              <el-input v-model="loginForm.username" placeholder="请输入用户名">
                <template #prefix>
                  <MyIcon type="icon-my"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginForm.contact" placeholder="请输入邮箱号/手机号">
                <template #prefix>
                  <MyIcon type="icon-my"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginForm.code" placeholder="请输入验证码">
                <template #prefix>
                  <MyIcon type="icon-code"/>
                </template>
                <template #suffix>
                  <el-button size="small">获取验证码</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
                <template #prefix>
                  <MyIcon type="icon-password"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginSubmit" round>立即注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container sign-in-container">
        <div>
          <h1>用户登录</h1>
          <el-form class="loginForm" :model="loginForm" label-width="0">
            <el-form-item>
              <el-input v-model="loginForm.username" placeholder="请输入用户名/手机号/邮箱号">
                <template #prefix>
                  <MyIcon type="icon-my"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
                <template #prefix>
                  <MyIcon type="icon-password"/>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="loginForm.username" placeholder="请点击右侧按钮验证">
                <template #prefix>
                  <MyIcon type="icon-code"/>
                </template>
                <template #suffix>
                  <el-button>验证</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item class="login-setting">
              <span class="remember"><el-checkbox v-model="remember" label="记住密码"></el-checkbox></span>
              <span class="forget">忘记密码</span>
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
              <span><MyIcon type="icon-qq-logo"/></span>
              <span><MyIcon type="icon-weibo-logo"/></span>
              <span><MyIcon type="icon-github-logo"/></span>
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
              <h1>注册光临</h1>
              <p>欢迎访问崔亮的博客，并与我们一起开始旅程<br>若您还没有账号，请立即注册</p>
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

const router = useRouter();
let {MyIcon} = icon()
// 背景图片地址
const bgiURL = ref('')
// 当前组件名称
const component = ref('login')
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
// 登录表单
const loginForm = reactive({
  username: '',
  password: ''
})
// 注册表单
const registerForm = reactive({
  username: '',
  contact: '',
  code: '',
  password: ''
})
// 是否记住密码
const remember = ref(false)
// 登录表单提交事件
const loginSubmit = () => {
  console.log("登上了")
}

// 获取背景图片
async function getBgiURLData() {
  const {url} = await getBgiUrl()
  bgiURL.value = 'url(' + url + ')'
}

onBeforeMount(() => {
  getBgiURLData()
})
// 其他页面调用，默认跳转
onMounted(() => {
  if (router.currentRoute.value.query.component) {
    component.value = router.currentRoute.value.query.component
  }
})
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
    opacity: 0.8;
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
