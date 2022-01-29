<template>
  <div class="background-img">
    <div class="container animate__animated animate__zoomIn">
      <h1>重置密码</h1>
      <div class="step">
        <el-steps :active="step" :space="200" simple>
          <el-step title="身份验证">
            <template #icon>
              <MyIcon type="icon-code"/>
            </template>
          </el-step>
          <el-step title="设置密码">
            <template #icon>
              <MyIcon type="icon-password"/>
            </template>
          </el-step>
          <el-step title="重置完成">
            <template #icon>
              <MyIcon type="icon-success"/>
            </template>
          </el-step>
        </el-steps>
      </div>
      <div class="main">
        <transition
            enter-active-class="animated animate__animated animate__fadeInRight"
            leave-active-class="animated animate__animated animate__fadeOutLeft"
        >
          <div v-show="step === 1" class="main-form">
            <el-form :model="verifyForm" ref="verifyRef" label-width="0" :rules="rules">
              <el-form-item prop="contact">
                <el-input v-model="verifyForm.contact" placeholder="请输入手机号/邮箱号">
                  <template #prefix>
                    <MyIcon type="icon-email"/>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model="verifyForm.code" placeholder="请输入验证码">
                  <template #prefix>
                    <MyIcon type="icon-code"/>
                  </template>
                  <template #suffix>
                    <div class="verify-btn">
                      <VerifyCodeBtn :btnDisabled="codeBtnDisabled" @pass="verifyPass"></VerifyCodeBtn>
                    </div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="verifyNext" type="primary" round class="next-btn">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <transition
            enter-active-class="animated animate__animated animate__fadeInRight"
            leave-active-class="animated animate__animated animate__fadeOutLeft"
        >
          <div v-show="step === 2" class="main-form">
            <el-form :model="verifyForm" ref="passwordRef" label-width="0" :rules="rules">
              <el-form-item prop="password1">
                <el-input v-model="verifyForm.password1" type="password" placeholder="请输入密码(数字+字符,8-16位)" show-password>
                  <template #prefix>
                    <MyIcon type="icon-password"/>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item prop="password2">
                <el-input v-model="verifyForm.password2" type="password" placeholder="请再次输入密码" show-password>
                  <template #prefix>
                    <MyIcon type="icon-password"/>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="passwordLast" type="info" round class="next-btn">上一步</el-button>
                <el-button @click="passwordNext" type="primary" round class="next-btn">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <transition
            enter-active-class="animated animate__animated animate__fadeInRight"
            leave-active-class="animated animate__animated animate__fadeOutLeft"
        >
          <div v-show="step === 3" class="main-form">
            <div class="success-icon">
              <MyIcon type="icon-success"/>
            </div>
            <p>恭喜，密码重置成功</p>
            <br>
            <el-button type="success" round class="next-btn" @click="$router.push('/loginRegister')">立即登录</el-button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import VerifyCodeBtn from "@/components/verify/VerifyCodeBtn.vue"
import icon from "@/utils/icon";
import {onMounted, reactive, ref} from "vue";
import {getBgiUrl} from "@/api/public";
import {getRegister, postCode, postSetPassword} from "@/api/account";
import {ElMessage} from "element-plus";

let {MyIcon} = icon();
// 背景图片地址
const bgiURL = ref("");

// 获取背景图片
async function getBgiURLData() {
  const {url} = await getBgiUrl();
  bgiURL.value = "url(" + url + ")";
}

// 身份验证表单对象
const verifyRef = ref(null)
// 密码验证表单对象
const passwordRef = ref(null)
// 当前步骤id
const step = ref(1);
// 验证表单
const verifyForm = reactive({
  contact: '',
  code: '',
  password: '',
  password1: '',
  password2: ''
})
// 联系方式验证
const checkContact = (rule, value, callback) => {
  console.log("开始验证了")
  if (!value) {
    return callback(new Error('请输入邮箱号/手机号'))
  }
  const phone = /^1[0-9]\d{9}$/;
  const email = /^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}$/
  if (!phone.test(value) && !email.test(value)) {
    console.log(value)
    console.log("格式验证没通过")
    return callback(new Error('手机号/邮箱号格式错误！'))
  }
  setTimeout(() => {
    getRegister(NaN, value).then((response) => {
      console.log(response)
      ElMessage({
        message: '邮箱号/手机号未注册,请更换邮箱号/手机号',
        type: 'warning',
      })
      callback(new Error('手机号/邮箱号不存在'))
    }).catch(response => {
      console.log(response)
      console.log("手机号/邮箱号已存在")
      codeBtnDisabled.value = false
      callback()
    });
  }, 500)
}
// 用户密码验证
const checkPassword1 = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  setTimeout(() => {
    verifyForm.password1 = value
    const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!pattern.test(value)) {
      console.log("没通过")
      callback(new Error('密码必须是数字+字符组合，8-16位长度！'))
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
    verifyForm.password2 = value
    const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!pattern.test(value)) {
      console.log("没通过")
      callback(new Error('密码必须是数字+字符组合，8-16位长度！'))
    } else {
      if (verifyForm.password1 !== verifyForm.password2) {
        callback(new Error('两次密码不一致'))
      } else {
        callback()
      }
    }
  }, 500)
}

// 表单验证规则
const rules = {
  contact: [{validator: checkContact, trigger: 'blur'}],
  code: [{required: true, message: '请输入验证码', trigger: 'blur',}],
  password1: [{validator: checkPassword1, trigger: 'blur'}],
  password2: [{validator: checkPassword2, trigger: 'blur'}]
}
// 获取验证码表单
const codeForm = reactive({
  contact: '',
  action: '重置密码',
  username: '用户',
})
// 获取验证码按钮默认状态
const codeBtnDisabled = ref(true)
// 获取注册验证码通过事件
const verifyPass = () => {
  console.log("通过验证了,开始获取验证码")
  codeForm.contact = verifyForm.contact
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
// 身份验证完成后点击下一步事件
const verifyNext = () => {
  verifyRef.value.validate((valid) => {
    if (valid) {
      step.value = step.value + 1;
    } else {
      ElMessage.error('请检查表单内容后再提交！')
      return false
    }
  })
}
// 设置密码后点击下一步事件
const passwordNext = () => {
  passwordRef.value.validate((valid) => {
    verifyForm.password = verifyForm.password1
    if (valid) {
      postSetPassword(verifyForm).then((response) => {
        console.log(response)
        step.value = step.value + 1;
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage.error(response.msg)
      });
    } else {
      ElMessage.error('请检查表单内容后再提交！')
      return false
    }
  })
}
// 设置密码上一步
const passwordLast = () => {
  step.value = step.value - 1;
}
onMounted(() => {
  getBgiURLData();
});
</script>

<style scoped lang="scss">
:deep(.is-text) {
  border: none;
}
:deep(.el-step__line){
  display: none;
}
.background-img {
  width: 100vw;
  height: 100vh;
  display: block;
  position: relative;
  // }
  .container {
    border-radius: 10px;
    background-color: $color-background-white;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: absolute;
    overflow: hidden;
    width: 480px;
    max-width: 100%;
    min-height: 400px;
    opacity: 0.8;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;

    h1 {
      color: $color-primary;
      padding: 10px 0 5px 0;
    }

    .step {
      .anticon {
        font-size: 25px;
      }
    }

    .main {
      display: flex;
      justify-content: center;

      .main-form {
        width: 260px;
        margin-top: 40px;

        .verify-btn {
          margin-top: 4px;
        }

        .success-icon {
          font-size: 60px;
          color: $color-success;
        }

        p {
          font-size: 18px;
          margin-top: 15px;
        }
      }

      .next-btn {
        margin-top: 15px;
      }
    }
  }
}

.background-img::after {
  content: "";
  background-image: v-bind("bgiURL");
  opacity: 0.9;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
  filter: blur(1px);
}

.animated {
  animation-duration: 600ms;
  animation-timing-function: ease-in;
}


</style>
