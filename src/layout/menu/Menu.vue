<template>
  <template v-for="(item, index) in menuList" :key="index">
    <template v-if="!item.children">
      <!-- 没有子路由 -->
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span> {{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有一个子路由 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        @click="goRoute"
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span> {{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多个子路由  递归组件 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span> {{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
//获取路由对象
import { useRouter } from "vue-router";
const router = useRouter();

//获取父组件传递来的全部 路由
defineProps(["menuList"]);
const goRoute = (vc: any) => {
  console.log(vc, "@@@@@@@@@@@@@@@@");
  //会自动注入 点击的实例
  router.push(vc.index);
};
</script>
<script lang="ts">
export default {
  //递归组件必须有名字
  name: "Menu",
};
</script>

<style scoped></style>
