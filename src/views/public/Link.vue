<template>
  <NavMenu></NavMenu>
  <div class="page">
    <div v-motion-fade-visible :duration="1500">
      <LinkContent :title="recommend.title" :linkList="recommend.link_list"></LinkContent>
      <LinkContent :title="link.title" :linkList="link.link_list"></LinkContent>
      <div class="title pointer" @click="$router.push('/applyLink')">
        📨 申请友链
      </div>
    </div>
  </div>
  <Footer></Footer>
  <BackTop></BackTop>
</template>

<script setup name="Link">
import NavMenu from "@/components/common/NavMenu.vue";
import Footer from "@/components/common/Footer.vue"
import BackTop from "@/components/common/BackTop.vue"
import LinkContent from "@/components/link/LinkContent.vue"
import {onActivated, onMounted, reactive} from "vue";
import {getLink} from "@/api/management";
import useStore from "@/store";
const {common} = useStore();

const recommend = reactive(
    {
      title: '🔥 强烈推荐',
      link_list: []
    })
const link = reactive(
    {
      title: '⚓ 友情链接',
      link_list: []
    })

// 获取友情链接数据
async function linkData() {
  let link_data = await getLink()
  for (let i in link_data) {
    if (link_data[i].type === "2") {
      recommend.link_list.push(link_data[i])
    } else {
      link.link_list.push(link_data[i])
    }
  }
}

onMounted(() => {
  linkData()
})
onActivated(() => {
  common.setMenuIndex('')
})
</script>

<style scoped lang="scss">
.title {
  font-size: 25px;
  margin: 20px 0 15px 0;
}
.title:hover{
  color: var(--el-color-primary);
}
</style>
