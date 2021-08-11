<template>
    <ul
        class="list"
        v-infinite-scroll="load"
        infinite-scroll-disabled="disabled">
      <li v-for="i in count" class="list-item">{{ i }}</li>
    </ul>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
</template>

<script setup>
import {defineComponent, ref, computed} from 'vue';

const count = ref(10);
const loading = ref(false);
const noMore = computed(() => count.value >= 20);
const disabled = computed(() => loading.value || noMore.value);
const load = () => {
  loading.value = true;
  setTimeout(() => {
    count.value += 2;
    loading.value = false;
  }, 2000);
}
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
