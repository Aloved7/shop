<template>
  <div class="tabbar">
    <div class="tabbar_left">
      <Dropdown></Dropdown>
    </div>
    <div class="tabbar_right">
      <Setting></Setting>
    </div>
  </div>
</template>

<script setup lang="ts">
import Dropdown from "./dropdown/Index.vue";
import Setting from "./setting/Index.vue";
</script>
<script lang="ts">
export default {
  name: "tabbar",
};
</script>

<style lang="less" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  background-image: linear-gradient(
    to right,
    rgb(186, 171, 176),
    rgb(188, 142, 142),
    rgb(253, 183, 183)
  );
  .tabbar_left {
    display: flex;
    // background: #000;
    align-items: center;
    margin-left: 20px;
  }
  .tabbar_right {
    display: flex;
    align-items: center;
  }
}
</style>
