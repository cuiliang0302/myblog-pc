<template>
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card>
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
          <el-descriptions-item label="手机：" label-align="right" align="center">
            {{ userInfo.phone }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱：" label-align="right" align="center">
            {{ userInfo.email }}
          </el-descriptions-item>
          <el-descriptions-item label="生日：" label-align="right" align="center">
            {{ userInfo.birthday }}
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
      <el-card>
        <template #header>
          <div>
            <span>数据统计</span>
          </div>
        </template>
        <el-row :gutter="10">
          <el-col :span="8">
            <div class="number-count-card article-card"><p class="count-card-title">浏览文章数</p>
              <p class="count-card-number">{{ dataCount.article_history }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card article-card"><p class="count-card-title">收藏文章数</p>
              <p class="count-card-number">{{ dataCount.article_collect }}</p>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card article-card"><p class="count-card-title">评论文章数</p>
              <p class="count-card-number">{{ dataCount.article_comment }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card section-card"><p class="count-card-title">浏览笔记数</p>
              <p class="count-card-number">{{ dataCount.section_history }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card section-card"><p class="count-card-title">收藏笔记数</p>
              <p class="count-card-number">{{ dataCount.section_collect }}</p></div>
          </el-col>
          <el-col :span="8">
            <div class="number-count-card section-card"><p class="count-card-title">评论笔记数</p>
              <p class="count-card-number">{{ dataCount.section_comment }}</p></div>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="16">
      <el-card>
        <template #header>
          <span>浏览趋势</span>
        </template>
        <div id="trend" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card>
        <template #header>
          <span>浏览文章</span>
        </template>
        <div id="article" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10">
    <el-col :span="8">
      <el-card>
        <template #header>
          <span>浏览笔记</span>
        </template>
        <div id="note" :style="{ 'min-height': '300px' }"></div>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card>
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
import {onMounted, reactive, ref} from "vue";
import {getStatistics} from "@/api/record";
import {getEcharts} from "@/api/public";
import * as echarts from 'echarts'

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
const isDark = false

// 浏览趋势折线图
async function trend() {
  let chartData = await getEcharts(userId.value, 'trend')
  console.log(chartData)
  for (let i in chartData.xAxis) {
    chartData.xAxis[i] = chartData.xAxis[i].slice(5)
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
        data: chartData.xAxis
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
        data: chartData.article_view
      },
      {
        name: '收藏文章数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.article_collect
      },
      {
        name: '评论文章数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.article_comment
      },
      {
        name: '浏览笔记数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.section_view
      },
      {
        name: '收藏笔记数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.section_comment
      },
      {
        name: '评论笔记数',
        type: 'line',
        stack: '总量',
        areaStyle: {},
        emphasis: {
          focus: 'series'
        },
        data: chartData.section_collect
      }
    ]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
};

// 浏览文章饼图
async function article() {
  let chartData = await getEcharts(userId.value, 'article')
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
        data: chartData.data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
};

// 浏览笔记雷达图
async function note() {
  let chartData = await getEcharts(userId.value, 'note')
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
      indicator: chartData.indicator
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: chartData.data,
          name: '笔记统计'
        }
      ]
    }]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
};
// 浏览时间柱形图
async function time() {
  let chartData = await getEcharts(userId.value, 'time')
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
      axisPointer: {            // Use axis to trigger tooltip
        type: 'shadow'        // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {
      data: ['文章', '笔记']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['00:00-01:59', '02:00-03:59', '04:00-05:59', '06:00-07:59', '08:00-09:59', '10:00-11:59', '12:00-13:59',
        '14:00-15:59', '16:00-17:59', '18:00-19:59', '20:00-21:59', '22:00-23:59'],
      axisLabel: {
        formatter: function (value) {
          return value.slice(6, 8);
        }
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '文章',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: chartData.article
      },
      {
        name: '笔记',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: chartData.section
      }
    ]
  });
  //自适应大小
  window.onresize = function () {
    myChart.resize();
  };
};
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
  height: 84px;
  background-color: $color-background-input;
  margin-bottom: 10px;
  text-align: center;
  border-radius: 5px;
  color: white;

  .count-card-title {
    font-size: 14px;
    padding: 10px;
  }

  .count-card-number {
    font-size: 30px;
  }
}

.article-card {
  background: #FF416C; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #FF4B2B, #FF416C); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #FF4B2B, #FF416C); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.section-card {
  background: #56CCF2; /* fallback for old browsers */
  background: -webkit-linear-gradient(to left, #2F80ED, #56CCF2); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to left, #2F80ED, #56CCF2); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
