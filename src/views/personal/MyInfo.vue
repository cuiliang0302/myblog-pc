<template>
  <el-card shadow="hover">
    <el-form ref="userInfoFormRef" :model="userInfoForm" label-width="120px" :rules="rules">
      <el-form-item label="头像：">
        <UploadImg v-show="false" ref="UploadImgRef" :width="150" :height="150" :dir="'photo'"
                   @saveImg="saveImg"></UploadImg>
        <el-avatar :size="100" :src="userInfoForm.photo"></el-avatar>
        <span class="photo-btn">
          <el-button size="default" type="success">
            <label class="pointer" for="uploads">更换头像</label>
          </el-button>
          <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);"
                 accept="image/png, image/jpeg, image/jpg" @change="changePhoto($event)">
        </span>
      </el-form-item>
      <el-form-item label="用户名：" prop="username">
        <el-input v-model="userInfoForm.username" clearable style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="用户来源：">
        <el-input v-model="userInfoForm.source" disabled style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="性别：">
        <el-radio v-model="userInfoForm.sex" label="1" size="large" border>男</el-radio>
        <el-radio v-model="userInfoForm.sex" label="2" size="large" border>女</el-radio>
      </el-form-item>
<!--      <el-form-item label="手机号：">-->
<!--        <el-input v-model="userInfoForm.phone" disabled style="width: 30%"></el-input>-->
<!--        <el-button class="change-btn" type="primary" plain>更换手机</el-button>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="邮箱号：">-->
<!--        <el-input v-model="userInfoForm.email" disabled style="width: 30%"></el-input>-->
<!--        <el-button class="change-btn" type="primary" plain>更换邮箱</el-button>-->
<!--      </el-form-item>-->
      <el-form-item label="地区：" v-if="areaData.length>0">
        <el-cascader
            v-model="userInfoForm.area_code"
            :options="areaData"
            :props="props"
            @change="handleChange"
            style="width: 30%"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="生日：">
        <el-date-picker v-model="userInfoForm.birthday" type="date" placeholder="请选择日期" style="width: 30%"
                        @change="changeDate">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="个人站点：" prop="web">
        <el-input v-model="userInfoForm.web" clearable style="width: 50%"></el-input>
      </el-form-item>
      <el-form-item label="个性签名：">
        <el-input
            v-model="userInfoForm.signature"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
        >
        </el-input>
      </el-form-item>
      <el-form-item class="form-btn">
        <el-button type="primary" @click="onSubmit">提交</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup name="MyInfo">
import {onMounted, reactive, ref} from "vue";
import {getRegister, getUserinfoId, putUserinfoId} from "@/api/account";
import {getAreaData} from "@/api/public";
import UploadImg from "@/components/common/UploadImg.vue"
import {ElMessage} from "element-plus";
import timeFormat from "@/utils/timeFormat";
import useStore from "@/store";
const {user} = useStore();
let {timeDate} = timeFormat()

// 我的信息表单
const userInfoForm = reactive({});
// 表单对象
const userInfoFormRef = ref(null)
// 原始用户名
const oldUsername = ref()
// 异步校验用户名
const checkUsername = (rule, value, callback) => {
  if (value !== oldUsername.value) {
    getRegister(value, NaN).then((response) => {
      console.log(response)
      callback()
    }).catch(response => {
      //发生错误时执行的代码
      console.log(response)
      return callback(new Error(response.msg))
    });
  } else {
    callback()
  }
}
// 异步校验网址
const checkWeb = (rule, value, callback) => {
  const pattern = /[a-zA-z]+:\/\/[^\s]*/
  if (pattern.test(value)) {
    callback()
  } else {
    return callback(new Error("请输入以https://开头的合法的URL地址"))
  }
}
// 表单校验规则
const rules = reactive({
  username: [{validator: checkUsername, trigger: 'blur'}],
  web: [{validator: checkWeb, trigger: 'blur'}],
})

// 获取用户信息
async function getUserinfo(userid) {
  const userinfo_data = await getUserinfoId(userid)
  for (let i in userinfo_data) {
    userInfoForm[i] = userinfo_data[i]
  }
  oldUsername.value = userInfoForm.username
  console.log(userInfoForm)
}

// 地区数据
const areaData = ref([])

// 获取地区数据
async function getArea() {
  let data = await getAreaData()
  for (let province in data.areaList.province_list) {
    const province_obj = {}
    province_obj.value = province
    province_obj.label = data.areaList.province_list[province]
    province_obj.children = []
    for (let city in data.areaList.city_list) {
      if (province_obj.value.substring(0, 2) === city.substring(0, 2)) {
        const city_obj = {}
        city_obj.value = city
        city_obj.label = data.areaList.city_list[city]
        province_obj.children.push(city_obj)
      }
    }
    areaData.value.push(province_obj)
  }
}

// 地区级联选择器配置
const props = {
  expandTrigger: 'hover'
}
// 地区级联选择器确认事件
const handleChange = (value) => {
  userInfoForm.area_code = value[1]
  let area_name = ''
  for (let i in areaData.value) {
    if (value[0] === areaData.value[i].value) {
      area_name = areaData.value[i].label
      for (let j in areaData.value[i].children) {
        if (value[1] === areaData.value[i].children[j].value) {
          area_name = area_name + areaData.value[i].children[j].label
        }
      }
    }
  }
  userInfoForm.area_name = area_name
}
// 图片上传对象组件
const UploadImgRef = ref(null)
// 更换图片事件
const changePhoto = ($event) => {
  UploadImgRef.value.uploadChange($event)
}
// 图片上传成功事件
const saveImg = (url) => {
  console.log(url)
  userInfoForm.photo = url
}
// 更改时间事件
const changeDate = (value) => {
  userInfoForm.birthday = timeDate(value)
}
// 表单重置事件
const reset = () => {
  getUserinfo(user.user_id)
}
// 表单提交事件
const onSubmit = () => {
  console.log('submit!')
  userInfoFormRef.value.validate((valid) => {
    if (valid) {
      putUserinfoId(user.user_id, userInfoForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '信息修改成功！',
          type: 'success',
        })
      }).catch(response => {
        //发生错误时执行的代码
        console.log(response)
        for (let i in response) {
          ElMessage.error(response[i][0])
        }
      });
    }
  })
}
onMounted(() => {
  getUserinfo(user.user_id)
  getArea()
})
</script>

<style scoped lang="scss">
.el-form {
  padding: 20px 50px 20px 0;
  .form-btn{
    margin-top: 50px;
  }
}

.photo-btn {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  margin-left: 120px;
}

.change-btn {
  margin-left: 30px;
}
</style>
