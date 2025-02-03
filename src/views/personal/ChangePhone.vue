<template>
  <el-card shadow="hover">
    <el-form ref="phoneFormRef" :model="phoneForm" label-width="120px" :rules="rules">
      <el-form-item label="新手机号：" prop="newPhone">
        <el-input v-model="phoneForm.newPhone" clearable style="width: 50%"
                  placeholder="请填写新手机号"></el-input>
      </el-form-item>
      <el-form-item label="验证码：" prop="code">
        <el-input v-model="phoneForm.code" clearable style="width: 50%"
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

<script setup name="ChangePhone">
// 验证密码表单
import {reactive, ref} from "vue";
import VerifyCodeBtn from "@/components/verify/VerifyCodeBtn.vue"
import {getRegister, postCode, putChangePhone} from "@/api/account";
import {ElMessage} from "element-plus";
import useStore from "@/store";
const {user} = useStore();
// 表单对象
const phoneFormRef = ref(null)
// 获取验证码表单
const codeForm = reactive({
  contact: '',
  action: '更换手机',
  username: '',
})
// 更换手机表单
const phoneForm = reactive({
  newPhone: '',
  code: '',
});
// 获取验证码按钮默认状态
const codeBtnDisabled = ref(true)
// 获取注册验证码通过事件
const pass = () => {
  console.log("通过验证了,开始获取验证码")
  codeForm.contact = phoneForm.newPhone
  codeForm.username = user.username
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
// 异步校验手机号
const checkContact = (rule, value, callback) => {
  const objRegExp = /^1[0-9]\d{9}$/;
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
    return callback(new Error("新手机号格式不正确！"))
  }
}
// 表单校验规则
const rules = reactive({
  newPhone: [{validator: checkContact, trigger: 'blur'}],
  code: [{required: true, message: '请输入验证码', trigger: 'blur',}]
})
// 表单重置事件
const reset = () => {
  phoneFormRef.value.resetFields()
}
// 表单提交事件
const onSubmit = () => {
  console.log('submit!')
  phoneFormRef.value.validate((valid) => {
    if (valid) {
      putChangePhone(user.user_id, phoneForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '手机号修改成功！',
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
