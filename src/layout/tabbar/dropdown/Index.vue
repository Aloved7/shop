<template>
  <el-icon style="margin-right: 10px" @click="changeIcon">
    <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    <!-- component 可以动态加载全局组件 -->
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <!-- 面包屑匹配路由展示标题 -->
    <el-breadcrumb-item
      v-for="(item, index) in route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <!-- 可以做动态路由跳转 -->
      <el-icon>
        <component :is="item.meta.icon"></component>
      </el-icon>
      <span style="margin: 0 5px">{{ item.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

//导入控制面包屑的小仓库
import useLayoutSettingStore from "@/store/modules/setting";

//获取仓库相关配置
let LayoutSettingStore = useLayoutSettingStore();

//点击图标方法
const changeIcon = () => {
  //用于控制菜单是否折叠的处理函数
  LayoutSettingStore.fold = !LayoutSettingStore.fold;
};

let route = useRoute();
/*const hanldeClick = () => {
  //动态展示 匹配路由不管多少级路由都会被展示
  console.log(route.matched);
};*/
</script>
<script lang="ts">
export default {
  name: "dropdown",
};
</script>

<style lang="scss" scoped></style>
