<template>
  <div class="item" v-for="item in items" :key="item.id">
    {{ item.content }}
  </div>
  <div v-if="loading" class="loading">加载中...</div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from "vue";

// 数据状态
const items = ref([]); // 数据列表
const loading = ref(false); // 加载状态
const page = ref(1); // 当前分页

// 模拟获取数据
const fetchData = async () => {
  if (loading.value) return; // 防止重复加载
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 模拟网络延迟
  const newItems = Array.from({ length: 10 }, (_, i) => ({
    id: (page.value - 1) * 10 + i + 1,  // 确保 ID 从 1 开始
    content: `内容 ${((page.value - 1) * 10) + i + 1}`,  // 内容对应 ID
  }));

  items.value.push(...newItems);
  loading.value = false;
  page.value += 1; // 增加页数
};


// 处理页面滚动事件
const handleScroll = () => {
  const {scrollTop, clientHeight, scrollHeight} = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10 && !loading.value) {
    fetchData();
  }
};

// 挂载和卸载滚动监听
onMounted(() => {
  fetchData(); // 初始化加载数据
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}

.item {
  padding: 100px;
  border-bottom: 1px solid #eee;
}

.loading {
  text-align: center;
  padding: 10px;
  color: #999;
}
</style>
