<template>
  <div class="text">这是测试页1</div>
  <el-form
      ref="ruleRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
  >
    <el-form-item label="Age" prop="age">
      <el-input v-model.number="ruleForm.age"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')"
      >Submit
      </el-button
      >
      <el-button @click="resetForm('ruleForm')">Reset</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import {reactive, ref} from "vue";

const ruleRef = ref(null)
const checkAge = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('Please input the age'))
  }
  setTimeout(() => {
    if (!Number.isInteger(value)) {
      callback(new Error('Please input digits'))
    } else {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'))
      } else {
        callback()
      }
    }
  }, 1000)
}
const ruleForm = reactive({
  age: '',
})
const rules = {
  age: [{validator: checkAge, trigger: 'blur'}],
}
const submitForm = (formName) => {
  ruleRef.value.validate((valid) => {
    if (valid) {
      alert('submit!')
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
const resetForm = (formName) => {
  ruleRef.value.resetFields()
}
</script>

<style lang="scss">
.other-login {
  .el-divider {
    background-color: yellow !important;
  }
}
</style>
