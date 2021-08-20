<template>
  <div>
    <div
        v-for="anchor in titleList"
        :style="{ padding: `10px 0 10px ${anchor.indent * 20}px` }"
        @click="rollTo(anchor,index)" :class="index===heightTitle?'title-active':''"
    >
      <a style="cursor: pointer">{{ anchor.title }}</a>
    </div>
    <v-md-preview :text="text" ref="editor" />
  </div>
</template>

<script setup>
import {ref, onMounted, nextTick, onBeforeUnmount} from 'vue';
import {getArticleDetail} from "@/api/blog";
// markdown-文章内容
const article = ref()
// markdown-对象
const editor = ref(null)
// markdown-文章标题列表
const titleList = ref([])
// markdown-获取内容
async function articleData(DetailID) {
  // axios获取内容
  article.value =  await getArticleDetail(DetailID)
}
// markdown-生成标题
async function getTitle() {
  await nextTick()
  // 使用js选择器，获取对应的h标签，组合成列表
  const anchors = editor.value.querySelectorAll(
      '.v-md-editor-preview h1,h2,h3,h4,h5,h6'
  )
  // 删除标题头尾的空格
  const titles = Array.from(anchors).filter((title) => !!title.innerText.trim());
  // 当文章h标签为空时，直接返回
  if (!titles.length) {
    titleList.value = [];
    return;
  }
  // 从h标签属性中，提取相关信息
  const hTags = Array.from(new Set(titles.map((title) => title.tagName))).sort();
  titleList.value = titles.map((el) => ({
    title: el.innerText, // 标题内容
    lineIndex: el.getAttribute('data-v-md-line'), // 标签line id
    indent: hTags.indexOf(el.tagName), // 标签层级
    height: el.offsetTop, // 标签距离顶部距离
  }));
}
// markdown-当前高亮的标题index
const heightTitle = ref(0)
// markdown-标题跳转
const rollTo = (anchor, index) => {
  console.log(anchor)
  const {lineIndex} = anchor;
  const heading = editor.value.querySelector(
      `.v-md-editor-preview [data-v-md-line="${lineIndex}"]`
  );
  console.log(heading)
  if (heading) {
    heading.scrollIntoView({behavior: "smooth", block: "start"})
  }
  heightTitle.value = index
}
// markdown-页面滚动
const scroll = () => {
  let timeOut = null; // 初始化空定时器
  return () => {
    clearTimeout(timeOut)   // 频繁操作，一直清空先前的定时器
    timeOut = setTimeout(() => {  // 只执行最后一次事件
      let scrollTop = window.pageYOffset
      // console.log(window.pageYOffset)
      const absList = [] // 各个h标签与当前距离绝对值
      titleList.value.forEach((item) => {
        absList.push(Math.abs(item.height - scrollTop))
      })
      // 屏幕滚动距离与标题具体最近的index高亮
      heightTitle.value = absList.indexOf(Math.min.apply(null, absList))
    }, 500)
  }
}
onMounted(async () => {
  // 获取第一篇文章内容
  await articleData(1)
  // 生成文章标题列表
  await getTitle()
  window.addEventListener('scroll', scroll())
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', scroll())
})
</script>
<style lang="scss">

</style>
