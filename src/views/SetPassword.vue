<template>
  <div class="background-img">
    <div class="container">
      <h1>重置密码</h1>
      <el-steps :active="step" align-center>
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
      <div class="main">
        <transition enter-active-class="animate__animated animate__fadeInRight animate__faster"
                    leave-active-class="animate__animated animate__fadeOutLeft animate__faster"
        >
          <div v-show="step===1" class="verify">
            <h1>这是身份验证表单</h1>
            <el-button @click="next" type="primary" round>下一步</el-button>
          </div>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeInRight animate__faster"
                    leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
          <div v-show="step===2" class="password">
            <h1>这是设置密码表单</h1>
            <el-button @click="next" type="primary" round>下一步</el-button>
          </div>
        </transition>
        <transition enter-active-class="animate__animated animate__fadeInRight animate__faster"
                    leave-active-class="animate__animated animate__fadeOutLeft animate__faster">
          <div v-show="step===3" class="success">
            <h1>这是完成了</h1>
            <el-button type="success" round>立即登录</el-button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import icon from '@/utils/icon'
import {onMounted, ref} from "vue";
import {getBgiUrl} from "@/api/public";

let {MyIcon} = icon()
// 背景图片地址
const bgiURL = ref('')

// 获取背景图片
async function getBgiURLData() {
  const {url} = await getBgiUrl()
  bgiURL.value = 'url(' + url + ')'
}

// 当前步骤id
const step = ref(1)
// 点击下一步事件
const next = () => {
  step.value = step.value + 1
}
onMounted(() => {
  getBgiURLData()
})
</script>

<style scoped lang="scss">
.background-img {
  width: 100vw;
  height: 100vh;
  display: block;
  position: relative;

  .container {
    border-radius: 10px;
    background-color: $color-background-white;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    position: absolute;
    overflow: hidden;
    width: 500px;
    max-width: 100%;
    min-height: 400px;
    opacity: 0.8;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px;
    text-align: center;

    .main {
      display: flex;
      justify-content: center;
      animation-timing-function: linear;
    }
  }
}

.background-img::after {
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
</style>
