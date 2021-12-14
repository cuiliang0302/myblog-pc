<template>
  <div class="title">
    {{ title }}
  </div>
  <el-row :gutter="20">
    <el-col :span="6" v-for="(item,index) in linkList" :key="index">
      <el-card shadow="hover">
        <span @click="toLink(item.url)" class="pointer">
          <div class="link-title">
            <span><el-avatar :src="item.logo" :size="50"></el-avatar></span>
            <span class="name">{{ item.name }}</span>
          </div>
          <p>{{ item.describe }}</p>
        </span>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import {ElMessage} from "element-plus";

const props = defineProps({
  // 友情链接类型标题
  title: {
    type: String,
    required: true,
    default: ''
  },
  // 友情链接列表
  linkList: {
    type: Array,
    required: true,
    default: []
  },
})

const toLink = (url) => {
  window.location.href = url
  ElMessage({
    message: '第三方网站跳转中...',
    type: 'success',
  })
}
</script>

<style scoped lang="scss">
.title {
  font-size: 25px;
  margin: 20px 0 15px 0;
}

.link-title {
  display: flex;
  align-items: center;

  .name {
    margin-left: 10px;
  }
}

p {
  margin: 15px 10px;
  line-height: 25px;
}
</style>
