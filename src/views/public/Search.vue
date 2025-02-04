 <template>
  <NavMenu></NavMenu>
  <section class="page">
    <div class="search-main animate__animated animate__zoomIn">
      <div class="search-title">
        <span><MyIcon type="icon-search-logo"/></span>
        <p v-if="searchKind==='article'">文章搜索</p>
        <p v-else>笔记搜索</p>
      </div>
      <div class="search-input">
      <span>
        <el-autocomplete
            v-model="key"
            :fetch-suggestions="querySearch"
            popper-class="my-autocomplete"
            placeholder="请输入要搜索的关键词"
            @select="handleSelect"
            clearable
            style="width: 600px"
            highlight-first-item
        >
        <template #prepend>
          <el-select v-model="searchKind" placeholder="Select" style="width: 100px" @change="changeKind">
            <el-option v-for="item in kind" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </template>
        <template #append>
          <p class="search-btn" @click="search">搜一搜</p>
        </template>
        <template #default="{ item }">
          <span :style="{'color':item.color}">{{ item.id }}.</span>
          <span class="search-top-item">{{ item.value }}</span>
        </template>
        </el-autocomplete>
      </span>
      </div>
    </div>
    <div v-show="searchList.length!==0" class="search-list animate__animated animate__fadeInUp">
      <el-card class="box-card">
        <ul v-if="searchKind==='article'">
          <li v-for="item in searchList" :key="item.id">
            <ArticleItem :article="item"></ArticleItem>
          </li>
        </ul>
        <ul v-else>
          <li v-for="item in searchList" :key="item.id">
            <SectionItem :section="item"></SectionItem>
          </li>
        </ul>
      </el-card>
    </div>
  </section>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup name="Search">
import {onActivated, onMounted, ref} from "vue";
import NavMenu from "@/components/common/NavMenu.vue";
import ArticleItem from "@/components/common/ArticleItem.vue";
import SectionItem from "@/components/common/SectionItem.vue"
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import icon from '@/utils/icon'
import Fuse from 'fuse.js'
import {getSearch, getSearchHot} from "@/api/record";
import {ElLoading, ElMessage} from "element-plus";
import useStore from "@/store";

const {user,common} = useStore();
const {MyIcon} = icon()
// 搜索关键词
const key = ref('')
// 搜索类型选项
const kind = [
  {text: '搜文章', value: 'article'},
  {text: '搜笔记', value: 'note'},
];
// 搜索类型值
const searchKind = ref('article')
// 热门搜索列表
let hotList = ref([])

// 获取搜索热词
async function searchKeyHotData() {
  hotList.value = await getSearchHot()
}

// 搜索热词颜色
const topColor = (topId) => {
  let color = ''
  switch (topId) {
    case 1:
      color = "#c0392b";
      break;
    case 2:
      color = "#e74c3c";
      break;
    case 3:
      color = "#d35400";
      break;
    case 4:
      color = "#e67e22";
      break;
    case 5:
      color = "#f39c12";
      break;
    case 6:
      color = "#f1c40f";
      break;
    case 7:
      color = "#27ae60";
      break;
    case 8:
      color = "#2ecc71";
      break;
    case 9:
      color = "#2980b9";
      break;
    case 10:
      color = "#3498db";
      break;
    default:
      color = "#3498db";
  }
  return color
}
// 点击搜索框展开热门搜索词
const querySearch = (queryString, cb) => {
  console.log(queryString)
  let hotListAll = []
  hotList.value.slice(0, 10).forEach(function (element, index) {
    hotListAll.push({'id': index + 1, 'value': element, 'color': topColor(index + 1)})
  })
  if (key.value.length === 0) {
    cb(hotListAll)
  } else {
    let resultList = []
    const fuse = new Fuse(hotList.value, {includeScore: false, keys: ["item"]})
    const result = fuse.search(queryString)
    console.log(result)
    result.forEach(function (item, index) {
      console.log(item.item)
      resultList.push({'id': index + 1, 'value': item.item, 'color': topColor(index + 1)})
    })
    cb(resultList)
  }
}
// 选择热门搜索词
const handleSelect = (item) => {
  key.value = item.value
  searchFn()
}
// 提交搜索请求
const searchFn = () => {
  let user_id
  if (user.isLoggedIn) {
    user_id = user.user_id
  } else {
    user_id = NaN
  }
  // 加载中动画
  const loading = ElLoading.service({
    lock: true,
    text: '玩命加载中……',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  searchList.value = []
  const params = {
    key: key.value,
    kind: searchKind.value,
    order: 'default'
  }
  if (user_id) {
    params['user_id'] = user_id
  }
  getSearch(params).then((response) => {
    console.log(response)
    searchList.value = response
    setTimeout(() => {
      loading.close()
    }, 500)
  }).catch(response => {
    //发生错误时执行的代码
    console.log(response)
    ElMessage.error(response.msg)
    setTimeout(() => {
      loading.close()
    }, 500)
  });
}
//切换搜索类型
const changeKind = () => {
  console.log("切换了")
  console.log(searchKind.value)
  if (key.value) {
    searchFn()
  }
}
// 搜索结果列表
const searchList = ref([])
// 点击执行搜索事件
const search = () => {
  console.log("点了")
  searchFn()
}
onMounted(() => {
  searchKeyHotData()
  common.setMenuIndex('7')
})
onActivated(() => {
  common.setMenuIndex('7')
})
</script>

<style scoped lang="scss">
:deep(.el-input-group__append) {
  background-color: var(--el-color-primary);
  width: 60px;
  transition: all 0.5s;
}

:deep(.el-input-group__append:hover) {
  cursor: pointer;
  background-color: var(--el-color-primary);
  transition: all 0.5s;
}

.search-top-item {
  margin-left: 10px;
}

.search-main {
  .search-title {
    margin: 50px auto 30px auto;
    width: 50%;
    text-align: center;
    font-size: 50px;

    p {
      display: inline-block;
      margin-left: 10px;
      font-size: 30px;
      vertical-align: 7.5px;
    }
  }

  .search-input {
    width: 600px;
    margin: 0 auto;

    .search-btn {
      font-size: 20px;
      color: white;
    }
  }
}

.search-list {
  margin-top: 40px;

  ul {
    list-style: none;
  }
}

</style>
