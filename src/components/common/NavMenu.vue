<template>
  <transition enter-active-class="animate__animated animate__fadeInDown"
              leave-active-class="animate__animated animate__fadeOutUp" mode="in-out">
    <header class="navigation-show" v-if="isNavigationVisible===true">
    <span v-show="props.kind==='front'" class="left">
      <el-image
          style="width: 40px; height: 40px"
          :src="siteConfig.logo"
          :fit="'fill'"></el-image>
      <span class="no-choose">{{ siteConfig.name }}</span>
    </span>
      <span class="middle">
      <el-menu :default-active="menu_index" :ellipsis="false" mode="horizontal">
        <el-menu-item index="1" @click="router.push('/')">
          <MyIcon type="icon-home"/>
          <span class="menu-title">首页</span>
        </el-menu-item>
        <el-sub-menu index="2">
          <template #title>
            <MyIcon type="icon-article"/>
            <span class="menu-title">文章</span>
          </template>
          <el-menu-item v-for="category in categoryList" :key="category.id"
                        :index="'2-'+category.id" @click="toCategory(category.id)">{{ category.name }}</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="3">
          <template #title>
            <MyIcon type="icon-note"/>
            <span class="menu-title">笔记</span>
          </template>
          <el-menu-item v-for="note in noteList" :key="note.id" :index="'3-'+note.id"
                        @click="router.push(`/catalog/${note.id}`)">{{ note.name }}</el-menu-item>
        </el-sub-menu>
        <el-menu-item index="4" @click="router.push('/classify')">
          <MyIcon type="icon-classify"/>
          <span class="menu-title">归档</span>
        </el-menu-item>
        <el-menu-item index="5" @click="router.push('/message')">
          <MyIcon type="icon-message"/>
          <span class="menu-title">留言板</span>
        </el-menu-item>
        <el-menu-item index="6" @click="router.push('/about')">
          <MyIcon type="icon-about"/>
          <span class="menu-title">关于</span>
        </el-menu-item>
      </el-menu>
    </span>
      <span class="right">
      <el-tooltip class="item" effect="dark" content="设置" placement="bottom">
        <span class="setting hvr-grow" @click="drawer_visible = true">
          <MyIcon type="icon-setting"/>
        </span>
      </el-tooltip>
      <el-tooltip class="item" effect="dark" content="搜索" placement="bottom">
        <span class="search hvr-grow" :style="{'color': (menu_index==='7' ? 'var(--el-color-primary)':'')}"
              @click="router.push('/search')">
          <MyIcon type="icon-search"/>
        </span>
      </el-tooltip>
      <span class="user">
        <el-dropdown v-if="user.isLoggedIn" @visible-change="dropdownChange">
          <span class="no-choose">
            <el-avatar :src="photo"></el-avatar>
            <p>{{ user.username }}
              <el-icon v-if="isDropdown"><ArrowUp/></el-icon>
              <el-icon v-else><ArrowDown/></el-icon>
            </p>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/personal')">个人中心</el-dropdown-item>
              <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <div v-else class="toLoginRegister">
          <span @click="toLogin">登录</span>
          <span @click="toRegister">注册</span>
        </div>
      </span>
    </span>
      <el-drawer
          title="系统设置"
          v-model="drawer_visible"
          :direction="'rtl'"
          :size="'25%'"
          :before-close="handleClose" destroy-on-close
      >
      <span>
        <el-divider></el-divider>
        <div class="display">
          <h4>显示模式</h4>
          <span>
            <img :class="is_dark===true?'':'img-active'" src="~@/assets/images/light.png" alt="">
            <img :class="is_dark===false?'':'img-active'" src="~@/assets/images/dark.png" alt="">
          </span>
            <el-switch
                style="display: block"
                v-model="is_dark"
                active-color="#303133"
                inactive-color="#f5f7fa"
                active-text="深色模式"
                inactive-text="浅色模式"
                @change="setDarkMode"
            />
        </div>
        <el-divider></el-divider>
        <div class="color">
          <h4>主题色</h4>
          <div>
            <el-tooltip v-for="(item,index) in themeList" :key="index"
                        effect="dark" :content="item.name" placement="top">
              <span :style="{backgroundColor:item.value}" :class="(theme_color===item.value?'color-active ':'')"
                    @click="colorChoose(item.name,item.value)"></span>
            </el-tooltip>
          </div>
         </div>
        <el-divider></el-divider>
        <div v-if="props.kind==='front'" class="nav-style">
          <h4>导航菜单</h4>
          菜单显示模式：
          <el-select v-model="navigation_mode" @change="navChange">
            <el-option
                v-for="item in navigationList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div v-else>
          <h4>侧边菜单</h4>
          是否折叠菜单：
          <el-switch v-model="aside_menu_fold" @change="asideMenuFoldChange"/>
        </div>
        <el-divider></el-divider>
      </span>
      </el-drawer>
    </header>
  </transition>
  <div class="placeholder"></div>
</template>

<script setup>
import {ElMessageBox, ElMessage} from 'element-plus'
import {onMounted, reactive, ref} from "vue";
import icon from '@/utils/icon'
import {ArrowDown, ArrowUp} from '@element-plus/icons-vue'
import {getCategory, getNote} from "@/api/blog";
import {getSiteConfig} from "@/api/management";
import {useRouter} from "vue-router";
import {getUserinfoId} from "@/api/account";
import useStore from "@/store";
import {storeToRefs} from 'pinia'
import color from "@/utils/color"
import navigation from "@/utils/navigation";

const {theme, common,user} = useStore()
const {menu_index} = storeToRefs(common)
const {isNavigationVisible, setNavigationMode,navigationList} = navigation()
const router = useRouter()
const {MyIcon} = icon()
const {themeList} = color()
const props = defineProps({
  // 导航栏类型(前台后台)
  kind: {
    type: String,
    required: false,
    default: 'front'
  }
})
//导航菜单-logo和name
const siteConfig = reactive({
  logo: '',
  name: '',
})

async function siteConfigData() {
  let data = await getSiteConfig()
  siteConfig.logo = data.logo
  siteConfig.name = data.name
  // console.log(siteConfig)
}

//导航菜单-文章分类
const categoryList = ref([])

async function categoryData() {
  categoryList.value = await getCategory()
  // console.log(categoryList.value)
}

//导航菜单-跳转文章列表
const toCategory = (categoryId) => {
  router.push({path: `/category/${categoryId}`})
}
//导航菜单-笔记分类
const noteList = ref([])

async function NoteData() {
  noteList.value = await getNote()
  // console.log(noteList.value)
}

// 跳转至登录页
const toLogin = () => {
  router.push({path: '/loginRegister', query: {component: 'Login'}})
}
// 跳转至注册页
const toRegister = () => {
  router.push({path: '/loginRegister', query: {component: 'Register'}})
}
// 个人中心-是否下拉状态
const isDropdown = ref(false)

// 个人中心-下拉事件
const dropdownChange = (value) => {
  isDropdown.value = value
}
// 个人中心-退出登录
const logout = () => {
  ElMessageBox.confirm(
      '真的要退出登录吗?',
      '退出登录',
      {
        confirmButtonText: '确认',
        cancelButtonText: '再想想',
        type: 'warning',
      }
  )
      .then(() => {
        ElMessage({
          type: 'success',
          message: '账号已成功退出，即将跳转至登录页',
        })
        localStorage.clear()
        sessionStorage.clear()
        router.replace('/loginRegister')
      })
      .catch(() => {
        console.log("算了，没退出")
      })
}
// 个人中心-用户头像
const photo = ref()

// 个人中心-获取用户头像
async function getPhotoData() {
  let data = await getUserinfoId(user.user_id)
  photo.value = data.photo
  console.log("photo:", photo.value)
}

//设置-菜单默认关闭
const {drawer_visible} = storeToRefs(common)
//设置-菜单关闭事件
const handleClose = () => {
  drawer_visible.value = false
};
// 设置-显示模式默认值
const {is_dark} = storeToRefs(theme)
// 设置-切换是否设置暗黑模式
const setDarkMode = () => {
  console.log("菜单栏执行切换事件", is_dark.value)
  theme.is_dark = is_dark.value
  theme.applyDark()
}
// 设置-侧边菜单显示是否折叠
const {aside_menu_fold} = storeToRefs(common)
// 设置-侧边菜单显示折叠切换事件
const asideMenuFoldChange = (value) => {
  console.log("点了啊")
  console.log(value)
  common.setAsideMenuFold (value)
}

// 设置-默认主题色
const {theme_color} = storeToRefs(theme)
// 设置-切换主题色事件
const colorChoose = (name, color) => {
  console.log(name, color)
  theme.toggleTheme(name, color)
}
// 设置-默认导航菜单样式
const {navigation_mode} = storeToRefs(theme)

// 设置-导航菜单样式切换事件
const navChange = (value) => {
  console.log("开始切换了啊", value)
  setNavigationMode(value)
}
onMounted(() => {
  // asideMenuFold.value = store.state.asideMenuFold
  siteConfigData()
  categoryData()
  NoteData()
  if (user.isLoggedIn) {
    getPhotoData()
  }
})
// 当前激活的菜单id
// const menu_index = computed(() => store.state.menu_index)
</script>

<style scoped lang="scss">
header {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--el-bg-color-overlay);

  .left {
    padding-left: 20px;
    width: 20%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color);
    height: 60px;

    span {
      margin-left: 20px;
    }
  }

  .middle {
    flex: 1;

    .menu-title {
      margin-left: 4px;
    }
  }

  .right {
    padding-right: 20px;
    width: 23%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color);
    height: 60px;
    flex-direction: row-reverse;
    cursor: pointer;

    .user {
      display: flex;
      align-items: center;

      .toLoginRegister {
        span {
          margin: 0 10px;
        }
      }

      span {
        color: var(--el-text-color-regular);
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
      color: var(--el-text-color-regular);
      margin-left: 35px;
    }
  }

  h4 {
    font-weight: normal;
    color: var(--el-text-color-primary);
    margin-top: 40px;
  }

  .display {
    color: var(--el-text-color-primary);

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
    color: var(--el-text-color-primary);

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
      background-image: url("/src/assets/images/yes.png");
      background-repeat: no-repeat;
    }
  }

  .nav-style {
    color: var(--el-text-color-primary);

    .el-select {
      width: 120px;
    }
  }
}

.placeholder {
  height: 61px;
}

.navigation-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 5;
}
</style>
