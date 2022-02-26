<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>我的信息</span>
          </div>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名：" label-align="right" align="center">
            {{ userInfo.username }}
          </el-descriptions-item>
          <el-descriptions-item label="性别：" label-align="right" align="center">
            <el-tag v-if="userInfo.sex='1'" size="small">男</el-tag>
            <el-tag v-else class="small" type="danger">女</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="来源：" label-align="right" align="center">
            {{ userInfo.source }}
          </el-descriptions-item>
          <el-descriptions-item label="生日：" label-align="right" align="center">
            {{ userInfo.birthday }}
          </el-descriptions-item>
          <el-descriptions-item label="手机：" label-align="right" align="center">
            {{ userInfo.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱：" label-align="right" align="center">
            {{ userInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item label="地区：" label-align="right" align="center">
            {{ userInfo.area_name }}
          </el-descriptions-item>
          <el-descriptions-item label="个人网站：" label-align="right" align="center">
            {{ userInfo.web }}
          </el-descriptions-item>
          <el-descriptions-item label="个性签名：" label-align="right" align="center">
            {{ userInfo.signature }}
          </el-descriptions-item>
        </el-descriptions>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="hover">
        <template #header>
          <div>
            <span>数据统计</span>
          </div>
        </template>
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="number-count-card article-card">
              <img src="/src/assets/images/read.png" alt=""/>
              <p class="count-card-title">浏览文章数</p>
              <p class="count-card-number">{{ dataCount.article_history }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card article-card">
              <img src="/src/assets/images/collection.png" alt=""/>
              <p class="count-card-title">收藏文章数</p>
              <p class="count-card-number">{{ dataCount.article_collect }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card article-card">
              <img src="/src/assets/images/comments.png" alt=""/>
              <p class="count-card-title">评论文章数</p>
              <p class="count-card-number">{{ dataCount.article_comment }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card section-card">
              <img src="/src/assets/images/read.png" alt=""/>
              <p class="count-card-title">浏览笔记数</p>
              <p class="count-card-number">{{ dataCount.section_history }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card section-card">
              <img src="/src/assets/images/collection.png" alt=""/>
              <p class="count-card-title">收藏笔记数</p>
              <p class="count-card-number">{{ dataCount.section_collect }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card section-card">
              <img src="/src/assets/images/comments.png" alt=""/>
              <p class="count-card-title">评论笔记数</p>
              <p class="count-card-number">{{ dataCount.section_comment }}</p></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="16">
      <el-card shadow="hover">
        <template #header>
          <span>最近7天浏览趋势</span>
        </template>
        <div id="trend" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="hover">
        <template #header>
          <span>浏览文章</span>
        </template>
        <div id="article" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-card shadow="hover">
        <template #header>
          <span>浏览笔记</span>
        </template>
        <div id="note" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card shadow="hover">
        <template #header>
          <span>浏览时间</span>
        </template>
        <div id="time" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
// 引入用户信息模块
import user from "@/utils/user";
import {getUserinfoId} from "@/api/account";
import {computed, onMounted, reactive, ref} from "vue";
import {getStatistics} from "@/api/record";
import {getEcharts} from "@/api/public";
import * as echarts from 'echarts'
import store from "@/store/index";

let {userId} = user();
// 用户信息
const userInfo = reactive({})

// 获取用户信息
async function getUserinfo() {
  Object.assign(userInfo, await getUserinfoId(userId.value));
}

// 数据概览
const dataCount = reactive({})

// 获取数据概览数据
async function statisticsData() {
  Object.assign(dataCount, await getStatistics(userId.value))
}

// echarts曲线颜色
const color = ref([
  "#74b9ff",
  "#81ecec",
  "#55efc4",
  "#a29bfe",
  "#ffeaa7",
  "#fab1a0",
  "#ff7675",
  "#ff7675",
  "#b2bec3"
])
// 是否开启暗黑模式
const isDark = store.state.dark
// 图表背景色
const bgc = computed(() => {
  console.log(isDark)
  if (isDark === true) {
    return '#141414'
  } else {
    return '#ffffff'
  }
})

// 浏览趋势折线图
async function trend() {
  const chartData = await getEcharts(userId.value, 'trend')
  console.log("trend", chartData)
  const date = []
  const article_view = []
  const article_collect = []
  const article_comment = []
  const section_view = []
  const section_collect = []
  const section_comment = []
  for (let i in chartData) {
    date.push(chartData[i].date.slice(5))
    article_view.push(chartData[i].article_view)
    article_collect.push(chartData[i].article_collect)
    article_comment.push(chartData[i].article_comment)
    section_view.push(chartData[i].section_view)
    section_collect.push(chartData[i].section_collect)
    section_comment.push(chartData[i].section_comment)
  }
  let myChart;
  if (isDark) {
    myChart = echarts.init(document.getElementById("trend"), 'dark');
  } else {
    myChart = echarts.init(document.getElementById("trend"));
  }
  // 绘制图表
  myChart.setOption({
    color: color.value,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: ['浏览文章数', '收藏文章数', '评论文章数', '浏览笔记数', '收藏笔记数', '评论笔记数']
    },
    grid: {
      left: '3%',
      right: '5%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: date
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '浏览文章数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: article_view
      },
      {
        name: '收藏文章数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: article_collect
      },
      {
        name: '评论文章数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: article_comment
      },
      {
        name: '浏览笔记数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: section_view
      },
      {
        name: '收藏笔记数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: section_comment
      },
      {
        name: '评论笔记数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: section_collect
      }
    ],
    backgroundColor: bgc.value
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}

// 浏览文章饼图
async function article() {
  let chartData = await getEcharts(userId.value, 'article')
  console.log("article", chartData)
  let myChart;
  if (isDark) {
    myChart = echarts.init(document.getElementById("article"), 'dark');
  } else {
    myChart = echarts.init(document.getElementById("article"));
  }
  // 绘制图表
  myChart.setOption({
    color: color.value,
    tooltip: {
      trigger: 'item'
    },
    legend: {
      type: 'scroll'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: chartData,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ],
    backgroundColor: bgc.value
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}

// 浏览笔记雷达图
async function note() {
  const chartData = await getEcharts(userId.value, 'note')
  console.log("note", chartData)
  const indicator = []
  const data = []
  for (let i in chartData) {
    const item = {
      name : chartData[i].name,
      max : chartData[i].max
    }
    indicator.push(item)
    data.push(chartData[i].data)
  }
  let myChart;
  if (isDark) {
    myChart = echarts.init(document.getElementById("note"), 'dark');
  } else {
    myChart = echarts.init(document.getElementById("note"));
  }
  // 绘制图表
  myChart.setOption({
    color: color.value,
    legend: {
      show: false
    },
    tooltip: {
      trigger: 'item'
    },
    radar: {
      // shape: 'circle',
      radius: '60%',
      indicator: indicator
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: data,
          name: '笔记统计'
        }
      ]
    }],
    backgroundColor: bgc.value
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}

// 浏览时间柱形图
async function time() {
  const chartData = await getEcharts(userId.value, 'time')
  console.log("time",chartData)
  const time = []
  const article = []
  const section = []
  for (let i in chartData){
    console.log(chartData[i])
    time.push(chartData[i].time)
    article.push(chartData[i].article)
    section.push(chartData[i].section)
  }
  let myChart;
  if (isDark) {
    myChart = echarts.init(document.getElementById("time"), 'dark');
  } else {
    myChart = echarts.init(document.getElementById("time"));
  }
  // 绘制图表
  myChart.setOption({
    color: color.value,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          formatter: function (params) {
            return params.value + ":00-"+params.value+":59";
          }
        }
      },
    },
    legend: {
      data: ['浏览文章数', '浏览笔记数']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data:time,
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '浏览文章数',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: article
      },
      {
        name: '浏览笔记数',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: section
      }
    ],
    backgroundColor: bgc.value
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
}

onMounted(() => {
  getUserinfo()
  statisticsData()
  trend()
  article()
  note()
  time()
})
</script>

<style scoped lang="scss">
.el-card {
  margin-bottom: 10px;
}

.number-count-card {
  height: 107px;
  margin-bottom: 10px;
  text-align: center;
  border-radius: 5px;
  color: var(--el-color-white);
  position: relative;

  img {
    border-style: none;
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 50px;
    opacity: 0.3;
  }

  .count-card-title {
    font-size: 16px;
    padding: 15px;
  }

  .count-card-number {
    margin-top: 6px;
    font-size: 36px;
  }
}

.article-card {
  background: #ff5f50; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #ed4551, #ff5f50); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #ed4551, #ff5f50); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.section-card {
  background: #3889fc; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #5455f5, #3889fc); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #5455f5, #3889fc); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
