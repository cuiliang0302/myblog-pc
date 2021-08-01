<template>
  <section class="aside">
    <el-card class="card-hover">
      <template #header>
        <span class="card-title no-choose">👍 推荐阅读</span>
      </template>
      <div class="recommend">
          <span class="recommend-hover"
                v-for="(article,item) in recommend" :key="article.id">
          <el-image
              style="width: 115px;height: 76px"
              :src="article.cover"
              :fit="'fill'">
            <template #placeholder>
              <span class="loading" v-loading="true"></span>
            </template>
          </el-image>
          <p class="no-choose">{{ article.title }}</p>
          </span>
      </div>
    </el-card>
    <el-card class="card-hover">
      <template #header>
        <el-dropdown @visible-change="dropdownChange" @command="handleCommand">
          <span class="no-choose">
            <span class="card-title no-choose">🔥 {{ isRanking }}
              <i :class="isDropdown?'el-icon-caret-top':'el-icon-caret-bottom'+' el-icon--right'"></i>
            </span>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                  v-for="(item,index) in ranking"
                  :key="index" :command="index"
                  :disabled="item.name===isRanking?true:false"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
      <ol class="ranking">
        <li v-for="article in articleRanking" :key="article.id">
          <p class="no-choose ranking-hover">{{ article.title }}</p>
        </li>
      </ol>
    </el-card>
    <div class="tag-list">
      各种标签
    </div>
    <div class="about">
      关于博主
    </div>
    <div class="statistics">
      网站信息
    </div>
  </section>
</template>

<script setup>
import {
  ElCard,
  ElImage,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
} from 'element-plus'
import Loading from "@/components/common/Loading.vue"
import {onMounted, reactive, ref} from "vue";
import {getArticle} from "@/api/blog";
//推荐阅读文章列表
const recommend = ref([])

async function recommendData() {
  let data = await getArticle(1, 6, '-is_recommend,-created_time')
  recommend.value = data.results
  console.log(recommend.value)
}

// 排行列表-全部种类
const ranking = ref([
  {name: '阅读排行', value: '-view'},
  {name: '点赞排行', value: '-like'},
  {name: '收藏排行', value: '-collect'},
  {name: '评论排行', value: '-comment'},
])
// 排行列表-当前种类
const isRanking = ref('阅读排行')
// 排行列表-文章排行
const articleRanking = ref([])
// 排行列表-切换种类
const handleCommand = (index) => {
  isRanking.value = ranking.value[index].name
  getArticle(1, 10,ranking.value[index].value).then((response) => {
    articleRanking.value = response.results
  })
};
// 排行列表-是否下拉状态
const isDropdown = ref(false)

// 排行列表-下拉事件
const dropdownChange = (value) => {
  isDropdown.value = value
}

async function rankingData() {
  let data = await getArticle(1, 10, '-view')
  articleRanking.value = data.results
  console.log(articleRanking.value)
}

onMounted(() => {
  recommendData()
  rankingData()
})
</script>

<style scoped lang="scss">
.aside {
  .recommend {
    display: flex;
    flex-wrap: wrap;
    transition: all 0.5s;

    &:hover {
      span {
        opacity: 0.5;
      }
    }

    span {
      &:hover {
        opacity: 1;
      }

      width: 113px;

      p {
        text-align: center;
        color: $color-text-regular;
        margin: 7px 0;
        line-height: 20px;
        font-size: 14px;
      }
    }

    span:nth-child(odd) {
      margin-right: 12px;
    }
  }

  .ranking {
    margin: 0;
    padding-left: 20px;
    line-height: 28px;

    li {
      p {
        color: $color-text-regular;
        margin: 0;
      }
    }

    li:nth-child(1) {
      color: #ff2c00;
    }

    li:nth-child(2) {
      color: #ff5a00;
    }

    li:nth-child(3) {
      color: #ff8105;
    }

    li:nth-child(4) {
      color: #fd9a15;
    }

    li:nth-child(5) {
      color: #dfad1c;
    }

    li:nth-child(6) {
      color: #6bc211;
    }

    li:nth-child(7) {
      color: #3cc71e;
    }

    li:nth-child(8) {
      color: #3cbe85;
    }

    li:nth-child(9) {
      color: #51b2ef;
    }

    li:nth-child(10) {
      color: #3498db;
    }
  }
}

.loading {
  display: flex;
  justify-content: center;
  padding-top: 80px;
}

.el-card {
  margin-bottom: 15px;
}
</style>

