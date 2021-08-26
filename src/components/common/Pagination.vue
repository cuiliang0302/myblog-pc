<template>
  <section class="pagination">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNumber"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        :page-count="pageCount"
        layout="total, sizes, prev, pager, next, jumper"
        :total="props.total">
    </el-pagination>
  </section>

</template>

<script setup>
import {
  ElPagination,
} from 'element-plus'
import {ref, watch} from "vue";

const props = defineProps({
  // 内容总条数
  total: {
    type: Number,
    required: true,
    default: 1,
  },
})
// 当前页
const pageNumber = ref(1)
// 默认每页显示数
const pageSize = ref(10)
// 总页数
const pageCount = ref(1)
const emit = defineEmits(['changePage']);
// 页码大小改变
const handleSizeChange = (val) => {
  console.log(`每页 ${val} 条`);
  pageSize.value = val
  pageCount.value = Math.trunc(props.total / val + 1)
  pageNumber.value = 1
  emit('changePage', pageSize.value, pageNumber.value);
};
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  pageNumber.value = val
  emit('changePage', pageSize.value, val);
};
watch(
    () => props.total,
    (newValue) => {
      pageCount.value = Math.trunc(newValue / pageSize.value + 1)
    }
)
</script>

<style scoped lang="scss">
.pagination {
  text-align: center;
  margin-top: 40px;
}
</style>
