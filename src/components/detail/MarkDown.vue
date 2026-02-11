<template>
  <div ref="editor">
    <v-md-preview :text="text" @copy-code-success="handleCopyCodeSuccess" @image-click="showImg"></v-md-preview>
  </div>
  <el-image-viewer v-if="images.isShow" :initial-index="images.currentIndex"
                   :url-list="images.MDimages" @close="images.isShow=false" :teleported="true">
  </el-image-viewer>
</template>

<script setup>
import {
  ElImageViewer,
} from 'element-plus'
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import sql from 'highlight.js/lib/languages/sql';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import scss from 'highlight.js/lib/languages/scss';
import xml from 'highlight.js/lib/languages/xml';
import {ElMessage} from "element-plus";
import {nextTick, onMounted, onBeforeUnmount, reactive, ref, watch} from "vue";
import useStore from "@/store";
import {storeToRefs} from 'pinia'
const {common} = useStore();
const {outline_list} = storeToRefs(common)
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('scss', scss);
hljs.registerLanguage('css', css);
hljs.registerLanguage('xml', xml);
VMdPreview.use(githubTheme, {
  codeHighlightExtensionMap: {
    vue: 'xml',
    less: 'scss',
  },
  Hljs: hljs,
}).use(createCopyCodePlugin()).use(createLineNumbertPlugin());
const props = defineProps({
  // markdown预览组件
  text: {
    type: String,
    required: true,
    default: '加载中…………'
  },
})
// markdown-代码复制
const handleCopyCodeSuccess = () => {
  ElMessage.success({
    message: '代码已复制至剪切板',
    type: 'success'
  });
}
// markdown-图片对象
const images = reactive({
  MDimages: [],
  currentIndex: 0,
  isShow: false,
})
// markdown-图片查看
const showImg = (MDimages, currentIndex) => {
  console.log("查看图片了啊")
  console.log(MDimages)
  console.log(currentIndex)
  images.MDimages = MDimages
  images.currentIndex = currentIndex
  images.isShow = true
}
// markdown-对象
const editor = ref(null)
// markdown-文章标题列表
const titleList = ref([])

// 防抖：图片/布局多次变化时只重算一次
let getTitleTimer = null
function scheduleGetTitle() {
  if (getTitleTimer) clearTimeout(getTitleTimer)
  getTitleTimer = setTimeout(() => {
    getTitleTimer = null
    getTitle()
  }, 150)
}

// markdown-获取标题（高度为相对文档的垂直位置，图片加载后需通过 ResizeObserver 重新计算）
async function getTitle() {
  if (!editor.value) return
  await nextTick()
  const anchors = editor.value.querySelectorAll(
      '.v-md-editor-preview h1,h2,h3,h4,h5,h6'
  )
  const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
  if (!titles.length) {
    titleList.value = [];
    outline_list.value = []
    common.setOutlineList(outline_list.value)
    return;
  }
  const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
  const docTop = () => window.pageYOffset || document.documentElement.scrollTop;
  titleList.value = titles.map((el) => ({
    title: el.innerText,
    lineIndex: el.getAttribute('data-v-md-line'),
    indent: hTags.indexOf(el.tagName),
    height: el.getBoundingClientRect().top + docTop(),
  }));
  outline_list.value = titleList.value
  common.setOutlineList(outline_list.value)
}

// 监听markdown内容发生变化
watch(
    () => props.text,
    (value) => {
      if (value) {
        getTitle()
      }
    }
)
// 监听是否查看大图，阻止默认事件
watch(
    () => images.isShow,
    (value) => {
      console.log(value)
      if (value){
        document.body.style.overflow='hidden'
      }else {
        document.body.style.overflow='visible'
      }
    }
)
let resizeObserver = null
let observedEl = null
onMounted(async () => {
  await getTitle()
  // 图片等资源加载会改变内容高度，用 ResizeObserver 在尺寸变化后重新计算标题位置
  observedEl = editor.value?.querySelector?.('.v-md-editor-preview') || editor.value
  if (observedEl) {
    resizeObserver = new ResizeObserver(scheduleGetTitle)
    resizeObserver.observe(observedEl)
  }
  // 预览区域内图片 load 时也触发重算（懒加载/慢速网络时更及时）
  const imgs = editor.value?.querySelectorAll?.('.v-md-editor-preview img') || []
  imgs.forEach((img) => {
    if (img.complete) scheduleGetTitle()
    else img.addEventListener('load', scheduleGetTitle)
  })
})
onBeforeUnmount(() => {
  if (resizeObserver && observedEl) {
    resizeObserver.unobserve(observedEl)
    resizeObserver.disconnect()
  }
  if (getTitleTimer) clearTimeout(getTitleTimer)
})
</script>

<style scoped>

</style>
