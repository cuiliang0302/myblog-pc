<template>
  <header>
    <span class="left">
      <el-image
          style="width: 40px; height: 40px"
          :src="siteConfig.logo"
          :fit="'fill'"></el-image>
      <span class="no-choose">{{ siteConfig.name }}</span>
    </span>
    <span class="middle">
      <el-menu :default-active="activeMenu" class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1" @click="router.push('/')">
          <MyIcon type="icon-home"/>
          首页
        </el-menu-item>
        <el-submenu index="2">
          <template #title>
            <MyIcon type="icon-article"/>
            文章
          </template>
          <el-menu-item v-for="category in categoryList" :key="category.id"
                        :index="'2-'+category.id" @click="toCategory(category.id)">{{ category.name }}</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template #title>
            <MyIcon type="icon-note"/>
            笔记
          </template>
          <el-menu-item v-for="note in noteList" :key="note.id">{{ note.name }}</el-menu-item>
        </el-submenu>
        <el-menu-item index="4">
          <MyIcon type="icon-classify"/>
          归档
        </el-menu-item>
        <el-menu-item index="5">
          <MyIcon type="icon-message"/>
          留言板
        </el-menu-item>
        <el-menu-item index="6">
          <MyIcon type="icon-about"/>
          关于
        </el-menu-item>
      </el-menu>
    </span>
    <span class="right">
      <span class="setting hvr-grow" @click="drawer = true">
        <MyIcon type="icon-setting"/>
      </span>
      <span class="search hvr-grow">
        <MyIcon type="icon-search"/>
      </span>
      <span class="user">
        <el-dropdown @visible-change="dropdownChange">
          <span class="no-choose">
            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>
            <p>逆飞的流星<i
                :class="isDropdown?' el-icon-arrow-up'+' el-icon--right':' el-icon-arrow-down'+' el-icon--right'"></i></p>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </span>
    </span>
    <el-drawer
        title="系统设置"
        v-model="drawer"
        :direction="'rtl'"
        :before-close="handleClose" destroy-on-close
    >
      <span>
        <div class="display">
          <h4>显示模式</h4>
          <span>
            <img :class="isDark===true?'':'img-active'" src="~@/assets/images/light.png" alt="">
            <img :class="isDark===false?'':'img-active'" src="~@/assets/images/dark.png" alt="">
          </span>
            <el-switch
                style="display: block"
                v-model="isDark"
                active-color="#303133"
                inactive-color="#f5f7fa"
                active-text="深色模式"
                inactive-text="浅色模式"
            />
        </div>
        <div class="color">
          <h4>主题色</h4>
          <div>
            <el-tooltip v-for="(color,index) in colorList" :key="index"
                        effect="dark" :content="color.name" placement="top">
              <span :class="(colorValue===color.value?'color-active ':'') + color.value"
                    @click="colorChoose(color.value)"></span>
            </el-tooltip>
          </div>
         </div>
        <div class="nav-style">
          <h4>导航菜单</h4>
          菜单显示模式：
          <el-select v-model="navValue">
            <el-option
                v-for="item in navList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
      </span>
    </el-drawer>
  </header>
</template>

<script setup>
import {
  ElMenuItem,
  ElMenu,
  ElSubmenu,
  ElIcon,
  ElImage,
  ElAvatar,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDrawer,
  ElSwitch,
  ElTooltip,
  ElOption,
  ElSelect,
} from 'element-plus'
import {onMounted, reactive, ref} from "vue";
import icon from '@/utils/icon'
import {getCategory, getNote} from "@/api/blog";
import {getSiteConfig} from "@/api/management";
import {useRouter} from "vue-router";

const router = useRouter()
let {MyIcon} = icon()
const props = defineProps({
  // 导航菜单-当前选中的菜单
  activeMenu: {
    type: String,
    required: true,
    default: 1
  },
})
// const activeMenu = ref('1')
//导航菜单-logo和name
const siteConfig = reactive({
  logo: '',
  name: '',
})

async function siteConfigData() {
  let data = await getSiteConfig()
  siteConfig.logo = data.logo
  siteConfig.name = data.name
  console.log(siteConfig)
}

//导航菜单-文章分类
const categoryList = ref([])

async function categoryData() {
  categoryList.value = await getCategory()
  console.log(categoryList.value)
}

//导航菜单-跳转文章列表
const toCategory = (categoryId) => {
  router.push({path: `/category/${categoryId}`})
}
//导航菜单-笔记分类
const noteList = ref([])

async function NoteData() {
  noteList.value = await getNote()
  console.log(noteList.value)
}

// 个人中心-是否下拉状态
const isDropdown = ref(false)

// 个人中心-下拉事件
const dropdownChange = (value) => {
  isDropdown.value = value
}
//设置-菜单默认关闭
const drawer = ref(false);
//设置-菜单关闭事件
const handleClose = () => {
  drawer.value = false
};
// 设置-显示模式默认值
const isDark = ref(false)
onMounted(() => {
  siteConfigData()
  categoryData()
  NoteData()
})
// 设置-默认主题色
const colorValue = ref('blue')
const colorList = [
  {name: '拂晓蓝(默认)', value: 'blue'},
  {name: '薄暮红', value: 'red'},
  {name: '火山橘', value: 'orange'},
  {name: '日暮黄', value: 'yellow'},
  {name: '极光绿', value: 'green'},
  {name: '酱紫', value: 'purple'},
]
const colorChoose = (value) => {
  colorValue.value = value
}
// 设置-默认导航菜单样式
const navValue = ref('auto')
const navList = [
  {value: 'auto', label: '自动'},
  {value: 'show', label: '固定显示'},
  {value: 'hide', label: '滚动隐藏'},
]
</script>

<style scoped lang="scss">
header {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $color-background-white;

  .left {
    padding-left: 20px;
    width: 20%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $color-border-base;
    height: 60px;

    span {
      margin-left: 20px;
    }
  }

  .middle {
    flex: 1;
  }

  .right {
    padding-right: 20px;
    width: 23%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid $color-border-base;
    height: 60px;
    flex-direction: row-reverse;

    .user {
      display: flex;
      align-items: center;

      span {
        color: $color-text-regular;
        font-size: 14px;

        p {
          display: inline;
          vertical-align: 14px;
          margin-left: 6px;
        }
      }

    }

    .search, .setting {
      font-size: 25px;
      color: $color-text-regular;
      margin-left: 35px;
    }
  }

  h4 {
    font-weight: normal;
    color: $color-text-primary;
    margin-top: 40px;
  }

  .display {
    color: $color-text-primary;

    img {
      width: 75px;
      height: 75px;
      margin: 0 20px 10px 20px;
      box-shadow: 0 2px 12px 0 gray;
      border-radius: 6px;
    }

    .img-active {
      box-shadow: 0 2px 12px 0 #409EFF;
    }
  }

  .color {
    color: $color-text-primary;

    span {
      display: inline-block;
      width: 30px;
      height: 30px;
      margin: 0 10px;
      border-radius: 5px;
      transition: all 0.5s;
      box-shadow: none;
      background-image: none;
    }

    span:hover {
      text-decoration: underline;
      cursor: pointer;
    }

    .color-active {
      box-shadow: 0 2px 13px 2px grey;
      background-image: url("src/assets/images/yes.png");
      background-repeat: no-repeat;
    }

    .blue {
      background-color: $color-primary;
    }

    .red {
      background-color: $color-other-alizarin;
    }

    .orange {
      background-color: $color-other-carrot;
    }

    .yellow {
      background-color: $color-other-sun-flower;
    }

    .green {
      background-color: $color-other-green;
    }

    .purple {
      background-color: $color-other-amethyst;
    }
  }

  .nav-style {
    color: $color-text-primary;

    .el-select {
      width: 120px;
    }
  }
}
</style>
