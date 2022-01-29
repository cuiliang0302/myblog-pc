<template>
  <el-card shadow="hover">
    <el-form ref="passwordFormRef" :model="verifyForm" label-width="120px" :rules="rules">
      <el-form-item label="当前密码：" prop="oldPassword">
        <el-input v-model="verifyForm.oldPassword" type="password" show-password clearable style="width: 50%"
                  placeholder="请填写当前密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码：" prop="password1">
        <el-input v-model="verifyForm.password1" type="password" show-password clearable style="width: 50%"
                  placeholder="请填写新密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="password2">
        <el-input v-model="verifyForm.password2" type="password" show-password clearable style="width: 50%"
                  placeholder="请再次填写新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import user from "@/utils/user";
import {ElMessage, ElMessageBox} from "element-plus";
import {getUserinfoId} from "@/api/account";
import store from "@/store";

const router = useRouter()
// 引入用户信息模块
let {userId} = user();
// 修改提交密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
});
// 表单对象
const passwordFormRef = ref(null)
// 验证密码表单
const verifyForm = reactive({
  oldPassword:'',
  password1: '',
  password2: '',
});
// 密码正则校验
const checkPasswordRegular = (rule, value, callback) => {
  console.log(value)
  const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
  console.log(pattern.test(value))
  if (pattern.test(value)) {
    callback()
  } else {
    console.log("没过去")
    callback(new Error('Age must be greater than 18'))
    // return callback(new Error("密码必须是数字+字符组合，8-16位长度！"))
  }
}
// 密码一致性校验
const checkPasswordSame = (rule, value, callback) => {
  console.log(value)
  // if (value && checkPasswordForm.password1 === checkPasswordForm.password2) {
  //   callback()
  // } else {
  //   return callback(new Error("新密码与确认密码不一致！"))
  // }
}
// 表单校验规则
const rules = reactive({
  oldPassword: [{validator: checkPasswordRegular, trigger: 'blur'}],
  password1: [{validator: checkPasswordRegular, trigger: 'blur'}],
  password2: [{validator: checkPasswordSame, trigger: 'blur'}],
})
// 表单重置事件
const reset = () => {

}
// 表单提交事件
const onSubmit = () => {
  console.log('submit!')
  passwordFormRef.value.validate((valid) => {
    if (valid) {
      // putUserinfoId(userId.value, userInfoForm).then((response) => {
      //   console.log(response)
      //   ElMessage({
      //     message: '信息修改成功！',
      //     type: 'success',
      //   })
      // }).catch(response => {
      //   //发生错误时执行的代码
      //   console.log(response)
      //   for (let i in response) {
      //     ElMessage.error(response[i][0])
      //   }
      // });
    }
  })
}

// 获取用户信息
async function getUserinfo(userid) {
  const userinfo_data = await getUserinfoId(userid)
  console.log(userinfo_data.source)
  if (userinfo_data.source !== '直接注册') {
    ElMessageBox.alert('您的账号直接使用' + userinfo_data.source + '登录即可，无需修改密码！', '修改密码提示', {
      confirmButtonText: 'OK',
      callback: () => {
        router.push('/personal/myIndex')
        store.commit('setAsideMenuIndex', '1')
      },
    })
  }
}
onMounted(() => {
  getUserinfo(userId.value)
})
</script>

<style scoped lang="scss">

</style>
