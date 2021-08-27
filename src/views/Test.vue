<template>
  <el-tree :data="data"
           show-checkbox
           :props="defaultProps" @node-click="handleNodeClick" node-key="id"
           :default-expanded-keys="[2, 3]"
           :default-checked-keys="[5]"></el-tree>
</template>

<script setup>
import {ref} from 'vue';
import {
  ElTree
} from 'element-plus'

const data = [{
  id: 1,
  label: '一级 1',
  children: [{
    id: 4,
    label: '二级 1-1',
  }]
}, {
  id: 2,
  label: '一级 2',
  children: [{
    id: 5,
    label: '二级 2-1'
  }, {
    id: 6,
    label: '二级 2-2'
  }]
}, {
  id: 3,
  label: '一级 3',
  children: [{
    id: 7,
    label: '二级 3-1'
  }, {
    id: 8,
    label: '二级 3-2'
  }]
}]
const handleNodeClick = (data) => {
  console.log(data);
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
