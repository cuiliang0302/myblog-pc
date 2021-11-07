<template>
  <div class="text">这是测试页1</div>
  <el-form
      :model="ruleForm"
      ref="formRef"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
  >
    <el-form-item label="Activity name" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"
      >Create
      </el-button
      >
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {reactive, ref} from "vue";
// 表单对象
const formRef = ref(null)
const ruleForm = reactive({
  name: '',
})
const rules = {
  name: [
    {
      required: true,
      message: 'Please input Activity name',
      trigger: 'blur',
    }]
}
const submitForm = (formName) => {
  console.log("点击提交")
  formRef.value.validate((valid) => {
    if (valid) {
      alert('submit!')
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const resetForm = (formName) => {
  this.$refs[formName].resetFields()
}
</script>

<style lang="scss">
.other-login {
  .el-divider {
    background-color: yellow !important;
  }
}
</style>
