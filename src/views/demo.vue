<template>
  <div class="login-register">
    <div :class="(component==='login'?'':'right-panel-active') + ' container'">
      <div class="form-container sign-up-container">
        <div>
          <h1>注册表单</h1>
          <button>立即注册</button>
        </div>
      </div>
      <div class="form-container sign-in-container">
        <div>
          <h1>登录表单</h1>
          <button>立即登录</button>
        </div>
      </div>
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <h1>登录欢迎页</h1>
            <button @click="toLogin">切换登录页</button>
          </div>
          <div class="overlay-panel overlay-right">
            <h1>注册欢迎页</h1>
            <button @click="toRegister">切换注册页</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onBeforeMount, ref} from "vue";
import {getBgiUrl} from "@/api/public";
// 背景图片地址
const bgiURL = ref('https://cn.bing.com//th?id=OHR.CinnamonFernNS_ZH-CN3822051382_1920x1080.jpg&rf=LaDigue_1920x1080.jpg')
// 当前组件名称
const component = ref('login')
// 切换登录页事件
const toLogin = () => {
  console.log("切换登录")
  component.value = 'login'
}
// 切换注册页事件
const toRegister = () => {
  console.log("切换注册")
  component.value = 'register'
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
    min-height: 480px;
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

      div {
        background: rgba(45, 52, 54, 1.0);
        display: flex;
        flex-direction: column;
        height: 100%;
        justify-content: center;
        align-items: center;
        text-align: center;
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
  }
}

.login-register::after {
  content: "";
  background-image: v-bind('bgiURL');
  opacity: 0.75;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  position: absolute;
  z-index: -1;
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
    background-color: rgba(255,255,255,0.5);
  }

  .overlay-left {
    transform: translateX(0);
    background-color: rgba(255,255,255,0.5);
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
  transform: translateX(20%);
}

</style>
