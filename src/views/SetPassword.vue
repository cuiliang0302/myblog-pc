<template>
  <div class="background-img">
    <div class="container">
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
          <div v-show="step === 1" class="verify">
            <el-form class="loginForm" :model="verifyForm" ref="loginRef" label-width="0" :rules="rules">
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
                      <VerifyCodeBtn :btnDisabled="codeBtnDisabled" @pass="registerPass"></VerifyCodeBtn>
                    </div>
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="next" type="primary" round class="next-btn">下一步</el-button>
              </el-form-item>
            </el-form>
          </div>
        </transition>
        <transition
            enter-active-class="animated animate__animated animate__fadeInRight"
            leave-active-class="animated animate__animated animate__fadeOutLeft"
        >
          <div v-show="step === 2" class="password">
            <h1>这是设置密码表单</h1>
            <el-button @click="next" type="primary" round class="next-btn">下一步</el-button>
          </div>
        </transition>
        <transition
            enter-active-class="animated animate__animated animate__fadeInRight"
            leave-active-class="animated animate__animated animate__fadeOutLeft"
        >
          <div v-show="step === 3" class="success">
            <h1>这是完成了</h1>
            <el-button type="success" round class="next-btn">立即登录</el-button>
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
import {getRegister, postCode} from "@/api/account";
import {ElMessage} from "element-plus";

let {MyIcon} = icon();
// 背景图片地址
const bgiURL = ref("");

// 获取背景图片
async function getBgiURLData() {
  const {url} = await getBgiUrl();
  bgiURL.value = "url(" + url + ")";
}

// 当前步骤id
const step = ref(1);
// 点击下一步事件
const next = () => {
  step.value = step.value + 1;
  console.log(step, "step");
};
// 验证表单
const verifyForm = reactive({
  contact: '',
  code: '',
})
// 联系方式验证
const checkContact = (rule, value, callback) => {
  console.log("开始验证了")
  if (!value) {
    return callback(new Error('请输入邮箱号/手机号'))
  }
  const phone = /^1[0-9]\d{9}$/;
  const email = /^[0-9a-zA-Z_]{0,19}@[0-9a-zA-Z]{1,13}\.[com,cn,net]{1,3}$/
  if (!phone.test(value)) {
    console.log(value)
    console.log("手机验证没通过")
    return callback(new Error('手机号/邮箱号格式错误！'))
  }
  if (!email.test(value)) {
    console.log(value)
    console.log("邮箱验证没通过")
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
// 表单验证规则
const rules = {
  contact: [{validator: checkContact, trigger: 'blur'}],
  code: [{required: true, message: '请输入验证码', trigger: 'blur',}]
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
onMounted(() => {
  getBgiURLData();
});
</script>

<style scoped lang="scss">
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

      .verify {
        width: 250px;
        margin-top: 40px;

        .verify-btn {
          margin-top: 4px;
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
