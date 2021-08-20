<template>

</template>

<script setup>
import {defineComponent, ref, computed, onMounted} from 'vue';
onMounted(()=>{
  console.log("aaa")
  let arr = [{height:1,title:'aaa'},{height:2,title:'abb'},{height:3,title:'acc'}]
  arr.indexOf()
})
</script>
<style lang="scss">
ul {
  li {
    background-color: skyblue;
    height: 100px;
    margin: 10px;
  }
}
</style>
