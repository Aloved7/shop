<template>
  <div class="container">
    <!-- 大屏展示内容 -->
    <div class="screen" ref="screen">
      <div class="top">
        <Top></Top>
      </div>
      <div class="bottom">
        <div class="left">
          <LeftTop class="tourist"></LeftTop>
          <LeftCenter class="sex"></LeftCenter>
          <LeftBottom class="age"></LeftBottom>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <RightTop class="rank"></RightTop>
          <RightCenter class="year"></RightCenter>
          <RightBottom class="count"></RightBottom>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
//引入左侧三个组件
import LeftTop from "./components/left-top/index.vue";
import LeftCenter from "./components/left-center/index.vue";
import LeftBottom from "./components/left-bottom/index.vue";
//引入中间组件
import Map from "./components/map/index.vue";
import Line from "./components/line/index.vue";
//引入右侧组件
import RightTop from "./components/right-top/index.vue";
import RightCenter from "./components/right-center/index.vue";
import RightBottom from "./components/right-bottom/index.vue";
import Top from "./components/Top/index.vue";
import { ref, onMounted } from "vue";
let screen = ref();

onMounted(() => {
  //挂载后调用 将大屏拉回正常 然后控制缩放比例
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
});

//控制缩放比例
function getScale(w = 1920, h = 1080) {
  const ww = window.innerWidth / w;
  const wh = window.innerHeight / h;
  return ww < wh ? ww : wh;
}

//监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`;
};
</script>

<style lang="less" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background: url("./images/bg.png") no-repeat;
  background-size: cover;
  .screen {
    // 控制缩放点到中间  然后再通过js将他拽回去
    transform-origin: left top;
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1920px;
    height: 1080px;
  }
  .top {
    width: 100%;
    height: 40px;
  }
  .bottom {
    display: flex;
    .left {
      flex: 1;
      height: 1040px;
      display: flex;
      flex-direction: column;
      .tourist {
        flex: 1.2;
        // background-color: red;
      }
      .sex {
        flex: 1;
      }
      .age {
        flex: 1;
      }
    }
    .right {
      margin-left: 38px;
      flex: 1;
      display: flex;
      flex-direction: column;
      .rank {
        flex: 1.3;
      }
      .year {
        flex: 1;
      }
      .count {
        flex: 1;
      }
    }
    .center {
      flex: 1.5;
      display: flex;
      flex-direction: column;
      .map {
        flex: 4;
      }
      .line {
        flex: 1;
      }
    }
  }
}
</style>
