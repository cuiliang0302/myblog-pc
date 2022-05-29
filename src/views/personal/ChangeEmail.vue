<template>
  <el-card shadow="hover">
    <el-form ref="emailFormRef" :model="emailForm" label-width="120px" :rules="rules">
      <el-form-item label="新邮箱号：" prop="newEmail">
        <el-input v-model="emailForm.newEmail" clearable style="width: 50%"
                  placeholder="请填写新邮箱号"></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <el-input v-model="emailForm.code" clearable style="width: 50%"
                  placeholder="请填写验证码">
          <template #suffix>
            <VerifyCodeBtn :btnDisabled="codeBtnDisabled" @pass="pass"></VerifyCodeBtn>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup name="ChangeEmail">
// 验证密码表单
import {reactive, ref} from "vue";
import VerifyCodeBtn from "@/components/verify/VerifyCodeBtn.vue"
import {getRegister, postCode, putChangeEmail} from "@/api/account";
import {ElMessage} from "element-plus";
import user from "@/utils/user";
// 引入用户信息模块
let {userId,userName} = user();
// 表单对象
const emailFormRef = ref(null)
// 获取验证码表单
const codeForm = reactive({
  contact: '',
  action: '更换邮箱',
  username: '',
})
// 更换邮箱表单
const emailForm = reactive({
  newEmail: '',
  code: '',
});
// 获取验证码按钮默认状态
const codeBtnDisabled = ref(true)
// 获取注册验证码通过事件
const pass = () => {
  console.log("通过验证了,开始获取验证码")
  codeForm.contact = emailForm.newEmail
  codeForm.username = userName.value
  postCode(codeForm).then((response) => {
    console.log(response)
    ElMessage({
      message: '验证码发送成功！',
      type: 'success',
    })
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error(response.msg)
  });
}
// 异步校验邮箱号
const checkContact = (rule, value, callback) => {
  const objRegExp = /^.+@.+$/;
  if (objRegExp.test(value)) {
    getRegister(NaN, value).then((response) => {
      console.log(response)
      codeBtnDisabled.value = false
      callback()
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      codeBtnDisabled.value = true
      return callback(new Error(response.msg))
    });
  } else {
    codeBtnDisabled.value = true
    return callback(new Error("新邮箱号格式不正确！"))
  }
}
// 表单校验规则
const rules = reactive({
  newEmail: [{validator: checkContact, trigger: 'blur'}],
  code: [{required: true, message: '请输入验证码', trigger: 'blur',}]
})
// 表单重置事件
const reset = () => {
  emailFormRef.value.resetFields()
}
// 表单提交事件
const onSubmit = () => {
  console.log('submit!')
  emailFormRef.value.validate((valid) => {
    if (valid) {
      putChangeEmail(userId.value, emailForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '邮箱号修改成功！',
          type: 'success',
        })
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        ElMessage.error(response.msg)
      });
    }
  })
}
</script>

<style scoped lang="scss">
.el-form {
  padding: 20px 50px 20px 0;
  .form-btn{
    margin-top: 50px;
  }
}
</style>
