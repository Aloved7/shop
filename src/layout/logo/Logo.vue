<template>
  <div class="logo" v-if="setting.isShow">
    <img :src="setting.logo" alt="" />
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
//引入标题logo配置文件
import setting from "@/setting";
</script>
<script lang="ts">
export default {
  name: "Logo",
};
</script>

<style scoped lang="less">
.logo {
  width: 100%;
  height: @base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 8px;
  img {
    width: 40px;
    height: 40px;
  }
  p {
    color: #fff;
    font-size: @base-logo-title-fontsize;
    margin-left: 10px;
  }
}
</style>
