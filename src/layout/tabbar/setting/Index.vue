<template>
  <el-button
    size="small"
    icon="Refresh"
    circle
    @click="updateRefsh"
  ></el-button>
  <el-button
    size="small"
    icon="FullScreen"
    circle
    @click="fullSrceen"
  ></el-button>
  <!-- 
    placement 出现的位置
    trigger 触发实际
   -->
  <el-popover placement="bottom" title="主题设置" :width="300" trigger="hover">
    <!-- 放置表单组件 -->
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          size="small"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          active-icon="MoonNight"
          inactive-icon="Sunny"
          inline-prompt
        />
      </el-form-item>
    </el-form>
    <!-- 限制了外部样式 -->
    <template #reference>
      <el-button size="small" icon="Setting" circle></el-button>
    </template>
  </el-popover>
  <img
    :src="useStore.avatar"
    style="width: 24px; height: 24px; margin: 0 20px; border-radius: 50%"
  />
  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ useStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="handleClick">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
//获取用户小仓库
import userStore from "@/store/modules/user";
//获取setting仓库数据
import useLayoutSettingStore from "@/store/modules/setting";
let layoutSetting = useLayoutSettingStore();

//生成路由对象
let router = useRouter();
let route = useRoute();

//用户仓库 存储用户信息
let useStore = userStore();
//刷新按钮点击回调
const updateRefsh = () => {
  layoutSetting.refsh = !layoutSetting.refsh;
};

//收集开关数据
let dark = ref<any>(false);

//点击按钮进行全屏模式
const fullSrceen = () => {
  let full = document.fullscreenElement; //可以判断当前文档是不是全屏模式
  if (!full) {
    //文档的 requestFullscreen 方法可以实现全屏模式
    document.documentElement.requestFullscreen();
  } else {
    //退出全屏模式
    document.exitFullscreen();
  }
};

//退出登录事件
const handleClick = async () => {
  //清除token 以及用户信息
  await useStore.loginOut();
  //并且进行路由跳转  点击按钮的时候带上当前的路由
  router.push({ path: "/login", query: { redirect: route.path } });
};

const color = ref("rgba(255, 69, 0, 0.68)");
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);

//切换暗黑模式
const changeDark = () => {
  //获取根节点
  let html = document.documentElement;
  //判断标签是否有dark类名
  dark.value ? (html.className = "dark") : (html.className = "");
};
//主题颜色的设置
const setColor = () => {
  //修改跟姐点的样式
  const html = document.documentElement;
  html.style.setProperty("--el-color-primary", color.value);
};
</script>
<script lang="ts">
export default {
  name: "Setting",
};
</script>

<style lang="scss" scoped></style>
