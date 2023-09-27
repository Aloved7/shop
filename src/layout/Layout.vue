<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo></Logo>
      <!-- 滚动组件 -->
      <el-scrollbar
        class="scrollbar"
        :class="{ fold: LayoutSettingStore.fold ? true : false }"
      >
        <!-- z展示菜单 -->
        <el-menu
          :collapse="LayoutSettingStore.fold ? true : false"
          :default-active="route.path"
          background-color="#001519"
          text-color="#fff"
        >
          <!-- 根据路由生成动态菜单 -->
          <Menu :menuList="store.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航栏 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Tabbar></Tabbar>
    </div>
    <!-- 底部内容区域 -->
    <div
      class="layout_main"
      :class="{ fold: LayoutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
//引入 内容组件
import Main from "./main/Index.vue";
import Logo from "./logo/Logo.vue";
import Menu from "./menu/Menu.vue";
import Tabbar from "./tabbar/Index.vue";

//引入user 小仓库 利用存储的路由动态生成菜单
import userStore from "@/store/modules/user";
//导入控制面包屑的小仓库
import useLayoutSettingStore from "@/store/modules/setting";

//获取仓库相关配置
let LayoutSettingStore = useLayoutSettingStore();
let store = userStore();

//获取路由实例
const route = useRoute();
</script>
<script lang="ts">
export default {
  name: "Layout",
};
</script>

<style scoped lang="less">
.layout-container {
  width: 100vw;
  height: 100vh;
  .layout_slider {
    color: white;
    width: @base-menu-width;
    height: 100vh;
    background-color:#000;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - @base-menu-logo-height);
      .el-menu {
        border-right: none;
      }
    }
  }
  .layout_tabbar {
    position: fixed;
    width: calc(100vw - @base-menu-width);
    height: @base-tabbar-height;
    top: 0;
    left: @base-menu-width;
    transition: all 0.3s;
    &.fold {
      width: calc(100vw - @base-menu-min-width);
      left: @base-menu-min-width;
    }
  }
  .layout_main {
    position: absolute;
    width: calc(100vw - @base-menu-width);
    height: calc(100vh - @base-tabbar-height);
    // background-color: #fff;
    top: @base-tabbar-height;
    left: @base-menu-width;
    padding: 20px;
    transition: all 0.3s;
    overflow: auto;
    &.fold {
      width: calc(100vw - 50px);
      left: @base-menu-min-width;
    }
  }
}
</style>
