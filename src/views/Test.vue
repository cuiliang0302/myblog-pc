<template>

</template>

<script setup>
import {defineComponent, ref, computed, onMounted} from 'vue';

onMounted(() => {
  const a = [1, 43, 124, 232, 432, 542, 654, 755, 788]
  const b = 452
  const absList = []
  a.forEach((item) => {
    absList.push(Math.abs(item - b))
  })
  console.log(absList.indexOf(Math.min.apply(null, absList)))
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
