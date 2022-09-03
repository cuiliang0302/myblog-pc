<template>
  <h1>这是测试页1</h1>
  <span><a target="_blank"><MyIcon type="icon-rss"/></a></span>
  <span><a target="_blank"><MyIcon type="icon-github-logo"/></a></span>
  <span><a target="_blank"><MyIcon type="icon-gitee"/></a></span>
</template>

<script setup>
import {ref} from "vue";
import icon from "@/utils/icon";

let {MyIcon} = icon()

</script>

<style scoped lang="scss">

</style>
