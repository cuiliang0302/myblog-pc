<template>
  <h1>这是父组件，名字叫{{ name }}</h1>
  <button type="button" @click="valueAdd">
    count is: {{ state.count }}
  </button>
  <hr/>
  <Test msg="吃了吗？" :status="state.count%2===0 ? '没吃饭' : '吃饭了'" @toFather="toFather"/>
</template>

<script setup>
// 引入组件
import {ref, reactive, onMounted} from 'vue'
import Test from '@/components/Test.vue';
// 定义变量
const name = ref('张三')
const state = reactive({count: 0})
// 定义方法
const valueAdd = () => {
  state.count++
}
// 获取子组件的传值
const toFather = (value) => {
  alert('父组件收到子组件的传值:' + value)
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
