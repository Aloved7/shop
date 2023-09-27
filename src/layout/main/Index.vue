<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
//获取setting仓库数据 进行刷新
import useLayoutSettingStore from "@/store/modules/setting";
let layoutSetting = useLayoutSettingStore();
//定义变量 控制组件的创建与销毁
let flag = ref(true);

//监控仓库数据变化
watch(
  () => layoutSetting.refsh,
  () => {
    // console.log(1234);
    //当点击刷新按钮后 销毁
    flag.value = false;
    //当模板渲染完毕后 立即调用
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>
<script lang="ts">
export default {
  name: "main",
};
</script>

<style lang="less" scoped>
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}
.fade-enter-active {
  transition: all 0.3s;
}
.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>
