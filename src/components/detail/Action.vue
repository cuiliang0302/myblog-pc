<template>
  <div class="action">
    <el-tooltip v-if="detailType==='section'" class="item" effect="dark" content="目录" placement="left">
      <div @click="setCatalog" :class="[catalogShow===true?'action-active':'']+' detail-action-hover'">
        <MyIcon type="icon-catalog"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="大纲" placement="left">
      <div @click="setOutline" :class="[outline_show===true?'action-active':'']+' detail-action-hover'">
        <MyIcon type="icon-outline"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="点赞" placement="left">
      <div @click="lickAction" :class="[isLike===true?'action-active':'']+' detail-action-hover'">
        <MyIcon type="icon-like"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="收藏" placement="left">
      <div @click="collectAction" :class="[isCollect===true?'action-active':'']+' detail-action-hover'">
        <MyIcon type="icon-collect"/>
      </div>
    </el-tooltip>
    <el-tooltip class="item" effect="dark" content="评论" placement="left">
      <div @click="commentAction" class="detail-action-hover">
        <MyIcon type="icon-comment"/>
      </div>
    </el-tooltip>
    <el-popover
        placement="left"
        :width="450"
        trigger="hover"
    >
      <template #reference>
        <div class="detail-action-hover">
          <MyIcon type="icon-exceptional"/>
        </div>
      </template>
      <div class="exceptional">
        <h3>觉得文章还不错？打赏一下</h3>
        <div>
          <span>
          <el-image
              style="width: 200px; height: 200px"
              :src="pay.ali_pay"
              fit="fill">
          </el-image>
            <br>
          <p>支付宝</p>
        </span>
          <span>
          <el-image
              style="width: 200px; height: 200px"
              :src="pay.wechat_pay"
              fit="fill">
          </el-image>
        <br>
          <p>微信</p>
        </span>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import {
  ElTooltip,
  ElPopover,
  ElImage,
} from 'element-plus'
import {ElMessage} from 'element-plus'
import icon from "@/utils/icon";
import {onMounted, reactive, ref} from "vue";
import {getInfo} from "@/api/management";
import useStore from "@/store";
import {storeToRefs} from 'pinia'
const {common} = useStore();
const {MyIcon} = icon()
const props = defineProps({
  // 组件类型
  detailType: {
    type: String,
    required: true,
    default: 'article'
  },
  // 目录是否显示
  catalogShow: {
    type: Boolean,
    required: false,
    default: true
  },
  // 文章是否已收藏
  isCollect: {
    type: Boolean,
    required: false,
    default: false
  }
})
const emit = defineEmits(['setCatalog', 'likeClick','collectClick']);
// 大纲是否显示
const {outline_show} = storeToRefs(common)
// 设置目录是否显示
const setCatalog = () => {
  emit('setCatalog');
}
// 设置大纲是否显示
const setOutline = () => {
  outline_show.value = !outline_show.value
}
// 博主打赏信息
const pay = reactive({
  wechat_pay: '',
  ali_pay: ''
})

// 获取博主信息-打赏地址
async function payData() {
  let data = await getInfo()
  pay.wechat_pay = data.wechat_pay
  pay.ali_pay = data.ali_pay
}

// 文章是否已点赞
const isLike = ref(false)
// 点赞事件
const lickAction = () => {
  if (isLike.value === false) {
    console.log(isLike.value)
    isLike.value = true
    emit('likeClick')
  }
}
// 收藏事件
const collectAction = () => {
  console.log("收藏文章了")
  emit('collectClick')
}
// 跳转评论事件
const commentAction = () => {
  const returnEle = document.querySelector("#comment");  //productId是将要跳转区域的id
  if (!!returnEle) {
    returnEle.scrollIntoView({behavior: 'smooth'}); // true 是默认的
  }
}
onMounted(() => {
  payData()
})
</script>

<style scoped lang="scss">


.action {
  position: fixed;
  bottom: 120px;
  width: 40px;
  height: 240px;
  right: 40px;

  > div {
    width: 40px;
    height: 40px;
    background-color: var(--el-bg-color-overlay);
    border-radius: 20px;
    box-shadow: 0 0 6px rgb(0 0 0 / 12%);
    cursor: pointer;
    margin-bottom: 10px;
    opacity: 0.7;

    .anticon {
      transform: translate(50%, 50%);
      color: var(--el-text-color-regular);
      transition: all 0.5s;
      font-size: 20px
    }
  }

  .action-active {
    background-color: var(--el-color-primary);
  }
}

//打赏弹窗样式
.exceptional {
  > div {
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      margin: 0 10px;
    }

    p {
      text-align: center;
    }
  }

  h3 {
    text-align: center;
    margin: 10px 0;
  }
}
</style>
