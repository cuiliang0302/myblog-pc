<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card shadow="hover" class="my-info-card">
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

<script setup name="MyIndex">
import {getUserinfo} from "@/api/account";
import {onMounted, reactive, ref, watch} from "vue";
import {getStatistics} from "@/api/record";
import {getUserEcharts} from "@/api/record";
import * as echarts from 'echarts'
import useStore from "@/store";
import {ElMessage} from "element-plus";

const {common, user, theme} = useStore();
// 用户信息
const userInfo = reactive({})

// 获取用户信息
const getUserinfoData = async () => {
  try {
    let response = await getUserinfo()
    Object.assign(userInfo, response[0]);
  } catch (error) {
    ElMessage({
      message: '获取用户信息失败',
      type: 'error',
      plain: true,
    })
  }
}

// 数据概览
const dataCount = reactive({})

// 获取数据概览数据
const statisticsData = async () => {
  try {
    let response = await getStatistics()
    Object.assign(dataCount, response)
  } catch (error) {
    ElMessage({
      message: '获取用户统计数据失败',
      type: 'error',
      plain: true,
    })
  }
}

// echarts明亮模式曲线颜色
const echartsLight = ref([
  "#008dd4",
  "#f1c40f",
  "#2ecc71",
  "#f2b3c9",
  "#16a085",
  "#e67e22",
  '#008dd0',
  '#c22931',
  '#8e44ad',
  '#157623',
])
// echarts暗黑模式曲线颜色
const echartsDark = ref([
  '#e1605e',
  '#3498db',
  '#658f95',
  '#e9937e',
  '#7cb9a0',
  '#f0734f',
  '#eed875',
  '#62996a',
  '#5db0b3',
  '#1abc9c',
])
// echarts背景色
const bgc = ref()
// echarts颜色
const color = ref()
// echarts文本颜色
const text = ref()
// 设置echarts主题色
const setColor = () => {
  console.log("判断是否是深色模式了")
  console.log()
  if (theme.is_dark === true) {
    bgc.value = '#1d1e1f'
    color.value = echartsDark.value
    text.value = '#b2b2b2'
  } else {
    bgc.value = '#ffffff'
    color.value = echartsLight.value
    text.value = '#2a2b2d'
  }
  console.log(bgc.value)
}

// 浏览趋势折线图
async function trend() {
  const query = {chart: 'trend'}
  const chartData = await getUserEcharts(query)
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
  if (theme.is_dark === true) {
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
      data: ['浏览文章数', '收藏文章数', '评论文章数', '浏览笔记数', '收藏笔记数', '评论笔记数'],
      textStyle: {
        color: text.value
      }
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
  const query = {chart: 'article'}
  const chartData = await getUserEcharts(query)
  console.log("article", chartData)
  let myChart;
  if (theme.is_dark === true) {
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
      type: 'scroll',
      textStyle: {
        color: text.value
      }
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
  const query = {chart: 'note'}
  const chartData = await getUserEcharts(query)
  console.log("note", chartData)
  const indicator = []
  const data = []
  for (let i in chartData) {
    const item = {
      name: chartData[i].name,
      max: chartData[i].max
    }
    indicator.push(item)
    data.push(chartData[i].data)
  }
  let myChart;
  if (theme.is_dark === true) {
    myChart = echarts.init(document.getElementById("note"), 'dark');
  } else {
    myChart = echarts.init(document.getElementById("note"));
  }
  // 绘制图表
  myChart.setOption({
    color: color.value,
    legend: {
      show: false,
      textStyle: {
        color: text.value
      }
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
  const query = {chart: 'time'}
  const chartData = await getUserEcharts(query)
  console.log("time", chartData)
  const time = []
  const article = []
  const section = []
  for (let i in chartData) {
    time.push(chartData[i].time)
    article.push(chartData[i].article)
    section.push(chartData[i].section)
  }
  let myChart;
  if (theme.is_dark === true) {
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
            return params.value + ":00-" + params.value + ":59";
          }
        }
      },
    },
    legend: {
      data: ['浏览文章数', '浏览笔记数'],
      textStyle: {
        color: text.value
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: time,
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

// 监听切换主题色事件
watch(() => theme.is_dark, (newVal) => {
  console.log("切换颜色了")
  console.log(newVal)
  setColor()
  trend()
  article()
  note()
  time()
}, {deep: true})
onMounted(() => {
  common.setMenuIndex('')
  console.log("dark", theme.is_dark)
  setColor()
  getUserinfoData()
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

.my-info-card {
  height: 330px;
}

.number-count-card {
  height: 107px;
  margin-bottom: 10px;
  text-align: center;
  border-radius: 5px;
  color: var(--el-bg-color-overlay);
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
