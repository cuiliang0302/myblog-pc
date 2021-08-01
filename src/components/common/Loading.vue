<template>
  <div class="main">
    <div class="loadEffect">
      <div><span></span></div>
      <div><span></span></div>
      <div><span></span></div>
      <div><span></span></div>
    </div>
  </div>


</template>

<script>
</script>

<style scoped lang="scss">
.main{
  width: 100%;
  height: 100%;
  position: relative;
}
a {
  display: block;
  text-align: center;
  font-size: 20px;
  margin-top: 200px;
}

.loadEffect {
  width: 70px;
  height: 70px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

}

.loadEffect div {
  width: 100%;
  height: 100%;
  position: absolute;
  -webkit-animation: load 2.08s linear infinite;
}

.loadEffect div span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: $color-secondary;
  position: absolute;
  left: 50%;
  margin-top: -10px;
  margin-left: -10px;
}

@-webkit-keyframes load {
  0% {
    -webkit-transform: rotate(0deg);
  }
  10% {
    -webkit-transform: rotate(45deg);
  }
  50% {
    opacity: 1;
    -webkit-transform: rotate(160deg);
  }
  62% {
    opacity: 0;
  }
  65% {
    opacity: 0;
    -webkit-transform: rotate(200deg);
  }
  90% {
    -webkit-transform: rotate(340deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }

}

.loadEffect div:nth-child(1) {
  -webkit-animation-delay: 0.2s;
}

.loadEffect div:nth-child(2) {
  -webkit-animation-delay: 0.4s;
}

.loadEffect div:nth-child(3) {
  -webkit-animation-delay: 0.6s;
}

.loadEffect div:nth-child(4) {
  -webkit-animation-delay: 0.8s;
}
</style>
