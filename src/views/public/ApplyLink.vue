<template>
  <NavMenu></NavMenu>
  <div class="page">
    <div class="animate__animated animate__zoomIn">
      <el-card>
        <template #header>
          <span class="card-title no-choose"><MyIcon type="icon-tips-color"/> 申请须知</span>
        </template>
        <div class="point-text">
          🥇 请确保贵站可以持续稳定运营<br>
          🥈 原创博客优先，技术类博客优先<br>
          🥉️ 申请前请先添加本站点友链<br>
          🤗️ 欢迎小伙伴们一起互相友链<br>
        </div>
      </el-card>
      <el-card class="demo">
        <template #header>
          <span class="card-title no-choose"><MyIcon type="icon-success-color"/> 申请示例</span>
        </template>
        <div class="point-text">
          网站名称：{{ webInfo.name }}<br>
          网站地址：{{ webInfo.domain }}<br>
          网站简介：{{ webInfo.describe }}<br>
          网站logo：{{ webInfo.logo }}<br>
        </div>
      </el-card>
      <el-card>
        <template #header>
          <span class="card-title no-choose"><MyIcon type="icon-form-color"/> 申请表单</span>
        </template>
        <div>
          <el-form ref="linkFormRef" :model="linkForm" label-width="120px" :rules="rules">
            <el-form-item label="网站名称" prop="name">
              <el-input v-model="linkForm.name"></el-input>
            </el-form-item>
            <el-form-item label="网站地址" prop="url">
              <el-input v-model="linkForm.url" placeholder="请输入完整地址，https://开头"></el-input>
            </el-form-item>
            <el-form-item label="网站简介" prop="describe">
              <el-input v-model="linkForm.describe"></el-input>
            </el-form-item>
            <el-form-item label="网站logo" prop="logo">
              <span v-if="linkForm.logo===''">
                <UploadImg :width="150" :height="150" :dir="'logo'" @saveImg="saveImg"></UploadImg>
              </span>
              <span v-else><el-avatar :size="100" :src="linkForm.logo"></el-avatar></span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button @click="reset">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-card>
    </div>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup>
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import UploadImg from "@/components/common/UploadImg.vue"
import {onMounted, reactive, ref} from "vue";
import {getSiteConfig, postLink} from "@/api/management";
import icon from "@/utils/icon";
import {ElMessage} from "element-plus";

let {MyIcon} = icon()
// 友链示例
const webInfo = reactive({
  name: '',
  logo: '',
  describe: '',
  domain: ''
})

// 获取网站配置数据
async function siteConfigData() {
  let siteConfig_data = await getSiteConfig()
  console.log(siteConfig_data)
  webInfo.name = siteConfig_data.name
  webInfo.logo = siteConfig_data.logo
  webInfo.describe = siteConfig_data.title.slice(6)
  webInfo.domain = siteConfig_data.domain
}

// 图片上传成功事件
const saveImg = (url) => {
  console.log(url)
  linkForm.logo = url
}
// 提交友链表单对象
const linkFormRef = ref(null)
// 提交友链表单
const linkForm = reactive({
  url: '',
  name: '',
  describe: '',
  logo: '',
})
// url校验
const checkUrl = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('请输入网站地址'))
  }
  const pattern = /[a-zA-z]+:\/\/[^\s]*/
  if(pattern.test(value)){
    callback()
  }else {
    callback(new Error('请输入正确的网站地址'))
  }
}
// 表单验证规则
const rules = {
  url: [{validator: checkUrl, trigger: 'blur',}],
  name: [{required: true, message: '请输入网站名称', trigger: 'blur',}],
  describe: [{required: true, message: '请输入网站描述', trigger: 'blur',}],
  logo: [{required: true, message: '请上传网站logo', trigger: 'blur',}],
}

// 提交表单事件
const onSubmit = () => {
  console.log('submit!')
  linkFormRef.value.validate((valid) => {
    if (valid) {
      postLink(linkForm).then((response) => {
        console.log(response)
        ElMessage({
          message: '友链申请提交成功，请耐心等待审核！',
          type: 'success',
        })
        linkForm.url = ''
        linkForm.name = ''
        linkForm.describe = ''
        linkForm.logo = ''
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
// 重置表单
const reset = () => {
  linkFormRef.value.resetFields()
}
onMounted(() => {
  siteConfigData()
})
</script>

<style scoped lang="scss">
.demo {
  margin: 15px 0
}

.point-text {
  line-height: 30px;
  color: var(--el-text-color-primary);
}
</style>
