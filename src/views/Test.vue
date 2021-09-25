<template>
  <div id="loader">
    <ul class="hexagon-container">
      <li class="hexagon hex_1"></li>
      <li class="hexagon hex_2"></li>
      <li class="hexagon hex_3"></li>
      <li class="hexagon hex_4"></li>
      <li class="hexagon hex_5"></li>
      <li class="hexagon hex_6"></li>
      <li class="hexagon hex_7"></li>
    </ul>
  </div>
</template>

<script setup>
import {ElMessage, ElButton} from 'element-plus'
import {onBeforeUnmount, onMounted, reactive, ref} from 'vue';

onMounted(() => {
  console.log(import.meta.env.MODE)
})


</script>

<style scoped lang="scss">
#loader {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 160px;
  height: 160px;
  margin: -80px 0px 0px -80px;
  background-color: transparent;
  border-radius: 50%;
  border: 2px solid #B8DDF9;
}
#loader li {
  list-style-type: none;
}
#loader:before {
  content: "";
  width: 164px;
  height: 164px;
  display: block;
  position: absolute;
  border-radius: 50%;
  top: -2px;
  left: -2px;
  box-sizing: border-box;
  clip: rect(0px, 35px, 35px, 0px);
  z-index: 10;
  animation: rotate infinite;
  animation-duration: 3s;
  animation-timing-function: linear;
}
#loader:after {
  content: "";
  width: 164px;
  height: 164px;
  display: block;
  position: absolute;
  border: 2px solid #74b9ff;
  border-radius: 50%;
  top: -2px;
  left: -2px;
  box-sizing: border-box;
  clip: rect(0px, 164px, 150px, 0px);
  z-index: 9;
  animation: rotate2 3s linear infinite;
}

.hexagon-container {
  position: relative;
  top: 33px;
  left: 41px;
  border-radius: 50%;
}

.hexagon {
  position: absolute;
  width: 40px;
  height: 23px;
  background-color: #74b9ff;
}
.hexagon:before {
  content: "";
  position: absolute;
  top: -11px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-bottom: 11.5px solid #74b9ff;
}
.hexagon:after {
  content: "";
  position: absolute;
  top: 23px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 11.5px solid #74b9ff;
}

.hexagon.hex_1 {
  top: 0px;
  left: 0px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 0.214s;
}

.hexagon.hex_2 {
  top: 0px;
  left: 42px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 0.428s;
}

.hexagon.hex_3 {
  top: 36px;
  left: 63px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 0.642s;
}

.hexagon.hex_4 {
  top: 72px;
  left: 42px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 0.856s;
}

.hexagon.hex_5 {
  top: 72px;
  left: 0px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 1.07s;
}

.hexagon.hex_6 {
  top: 36px;
  left: -21px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 1.284s;
}

.hexagon.hex_7 {
  top: 36px;
  left: 21px;
  animation: Animasearch 3s ease-in-out infinite;
  animation-delay: 1.498s;
}

@keyframes Animasearch {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  15%, 50% {
    transform: scale(0.5);
    opacity: 0;
  }
  65% {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
    clip: rect(0px, 35px, 35px, 0px);
  }
  50% {
    clip: rect(0px, 40px, 40px, 0px);
  }
  100% {
    transform: rotate(360deg);
    clip: rect(0px, 35px, 35px, 0px);
  }
}
@keyframes rotate2 {
  0% {
    transform: rotate(0deg);
    clip: rect(0px, 164px, 150px, 0px);
  }
  50% {
    clip: rect(0px, 164px, 0px, 0px);
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(720deg);
    clip: rect(0px, 164px, 150px, 0px);
  }
}
@keyframes rotate3 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
