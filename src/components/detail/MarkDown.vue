<template>
  <div ref="editor">
    <v-md-preview :text="text" @copy-code-success="handleCopyCodeSuccess" @image-click="showImg"></v-md-preview>
  </div>
  <el-image-viewer v-if="images.isShow" :initial-index="images.currentIndex"
                   :url-list="images.MDimages" @close="images.isShow=false">
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
import {nextTick, onMounted, reactive, ref, watch} from "vue";
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
  images.MDimages = MDimages
  images.currentIndex = currentIndex
  images.isShow = true
}
// markdown-对象
const editor = ref(null)
// markdown-文章标题列表
const titleList = ref([])

// markdown-获取标题
async function getTitle() {
  await nextTick()
  const anchors = editor.value.querySelectorAll(
      '.v-md-editor-preview h1,h2,h3,h4,h5,h6'
  )
  // console.log(anchors)
  const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
  // console.log(titles)
  if (!titles.length) {
    titleList.value = [];
    return;
  }
  const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
  titleList.value = titles.map((el) => ({
    title: el.innerText,
    lineIndex: el.getAttribute('data-v-md-line'),
    indent: hTags.indexOf(el.tagName),
    height: el.offsetTop,
  }));
  console.log(titleList.value)
  outline_list.value = titleList.value
  // store.commit('setOutline', titleList.value)
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
onMounted(async () => {
  await getTitle()
})
</script>

<style scoped>

</style>
