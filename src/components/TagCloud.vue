<template>
  <div id="tags-cloud">
    <a v-for="(item,index) in tagList"
       :key="index"
       :style="'background-color:'+tagColor(item.id)"
       @click="$router.push(`/tag/${item.id}`)"
    >{{ item.name }}</a>
    <a v-for="(item,index) in tagList"
       :key="index"
       :style="'background-color:'+tagColor(item.id)"
       @click="$router.push(`/tag/${item.id}`)"
    >{{ item.name }}</a>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";
import {getTag} from "@/api/blog";
import color from "@/utils/color";

let {tagColor} = color()
const radius = 90;
const d = 200;
const dtr = Math.PI / 180;
const mcList = [];
let lasta = 1;
let lastb = 1;
const distr = true;
const tspeed = 11;
const size = 200;
const mouseX = 0;
const mouseY = 10;
const howElliptical = 1;
let aA = null;
let oDiv = null;
let sa = ''
let ca = ''
let sb = ''
let cb = ''
let sc = ''
let cc = ''
// 标签云-所有标签
const tagList = ref([])

async function tagData() {
  tagList.value = await getTag()
  console.log(tagList.value)
}

const begin = () => {
  let i = 0;
  let oTag = null;
  oDiv = document.getElementById('tags-cloud');
  aA = oDiv.getElementsByTagName('a');
  for (i = 0; i < aA.length; i++) {
    oTag = {};
    aA[i].onmouseover = (function (obj) {
      return function () {
        obj.on = true;
        this.style.zIndex = 9999;
        this.style.color = '#fff';
        this.style.padding = '5px 5px';
        this.style.filter = "alpha(opacity=100)";
        this.style.opacity = 1;
      }
    })(oTag)
    aA[i].onmouseout = (function (obj) {
      return function () {
        obj.on = false;
        this.style.zIndex = obj.zIndex;
        this.style.color = '#fff';
        this.style.padding = '5px';
        this.style.filter = "alpha(opacity=" + 100 * obj.alpha + ")";
        this.style.opacity = obj.alpha;
        this.style.zIndex = obj.zIndex;
      }
    })(oTag)
    oTag.offsetWidth = aA[i].offsetWidth;
    oTag.offsetHeight = aA[i].offsetHeight;
    mcList.push(oTag);
  }
  sineCosine(0, 0, 0);
  positionAll();
  setInterval(() => {
    update()
  }, 40)
};

const update = () => {
  let a, b, c = 0;
  a = (Math.min(Math.max(-mouseY, -size), size) / radius) * tspeed;
  b = (-Math.min(Math.max(-mouseX, -size), size) / radius) * tspeed;
  lasta = a;
  lastb = b;
  if (Math.abs(a) <= 0.01 && Math.abs(b) <= 0.01) {
    return;
  }
  sineCosine(a, b, c);
  for (var i = 0; i < mcList.length; i++) {
    if (mcList[i].on) {
      continue;
    }
    const rx1 = mcList[i].cx;
    const ry1 = mcList[i].cy * ca + mcList[i].cz * (-sa);
    const rz1 = mcList[i].cy * sa + mcList[i].cz * ca;

    const rx2 = rx1 * cb + rz1 * sb;
    const ry2 = ry1;
    const rz2 = rx1 * (-sb) + rz1 * cb;

    const rx3 = rx2 * cc + ry2 * (-sc);
    const ry3 = rx2 * sc + ry2 * cc;
    const rz3 = rz2;

    mcList[i].cx = rx3;
    mcList[i].cy = ry3;
    mcList[i].cz = rz3;

    const per = d / (d + rz3);

    mcList[i].x = (howElliptical * rx3 * per) - (howElliptical * 2);
    mcList[i].y = ry3 * per;
    mcList[i].scale = per;
    let alpha = per;
    alpha = (alpha - 0.6) * (10 / 6);
    mcList[i].alpha = alpha * alpha * alpha - 0.2;
    mcList[i].zIndex = Math.ceil(100 - Math.floor(mcList[i].cz));
  }
  doPosition();
}

const positionAll = () => {
  let phi = 0;
  let theta = 0;
  const max = mcList.length;
  for (let i = 0; i < max; i++) {
    if (distr) {
      phi = Math.acos(-1 + (2 * (i + 1) - 1) / max);
      theta = Math.sqrt(max * Math.PI) * phi;
    } else {
      phi = Math.random() * (Math.PI);
      theta = Math.random() * (2 * Math.PI);
    }
    //坐标变换
    mcList[i].cx = radius * Math.cos(theta) * Math.sin(phi);
    mcList[i].cy = radius * Math.sin(theta) * Math.sin(phi);
    mcList[i].cz = radius * Math.cos(phi);

    aA[i].style.left = mcList[i].cx + oDiv.offsetWidth / 2 - mcList[i].offsetWidth / 2 + 'px';
    aA[i].style.top = mcList[i].cy + oDiv.offsetHeight / 2 - mcList[i].offsetHeight / 2 + 'px';
  }
}

const doPosition = () => {
  const l = oDiv.offsetWidth / 2;
  const t = oDiv.offsetHeight / 2;
  for (let i = 0; i < mcList.length; i++) {
    if (mcList[i].on) {
      continue;
    }
    var aAs = aA[i].style;
    if (mcList[i].alpha > 0.1) {
      if (aAs.display != '')
        aAs.display = '';
    } else {
      if (aAs.display != 'none')
        aAs.display = 'none';
      continue;
    }
    aAs.left = mcList[i].cx + l - mcList[i].offsetWidth / 2 + 'px';
    aAs.top = mcList[i].cy + t - mcList[i].offsetHeight / 2 + 'px';
    //aAs.fontSize=Math.ceil(12*mcList[i].scale/2)+8+'px';
    //aAs.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+100*mcList[i].alpha+")";
    aAs.filter = "alpha(opacity=" + 100 * mcList[i].alpha + ")";
    aAs.zIndex = mcList[i].zIndex;
    aAs.opacity = mcList[i].alpha;
  }
}

const sineCosine = (a, b, c) => {
  sa = Math.sin(a * dtr);
  ca = Math.cos(a * dtr);
  sb = Math.sin(b * dtr);
  cb = Math.cos(b * dtr);
  sc = Math.sin(c * dtr);
  cc = Math.cos(c * dtr);
}
onMounted(async () => {
  await tagData()
  begin()
})
</script>

<style scoped lang="scss">
body {
  font-family: "微软雅黑", Arial, sans-serif;
}

body {
  background: #fbfbfb;
  color: #444;
  font-size: 14px;
}

a {
  color: #444;
  text-decoration: none;
}

a:hover {
  color: red;
}

/* tags-cloud */
#tags-cloud {
  width: 280px;
  height: 200px;
  position: relative;
  font-size: 12px;
  color: #333;
  margin: 0 auto;
  text-align: center;
}

#tags-cloud a {
  position: absolute;
  top: 0px;
  left: 0px;
  color: #333;
  font-family: Arial;
  text-decoration: none;
  margin: 0 10px 15px 0;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  padding: 1px 5px;
  display: inline-block;
  border-radius: 3px;
}

#tags-cloud a {
  color: #fff;
  transition: all 0.5s;
}

#tags-cloud a:hover {
  cursor: pointer;
  transform: scale(1.1)
}
</style>
