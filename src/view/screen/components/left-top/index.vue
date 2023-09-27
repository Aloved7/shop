<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量<span>9999</span></p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>
    <!-- 图形图标 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
//水球图拓展插件
import "echarts-liquidfill";
import { ref, onMounted } from "vue";
//定义人数数据
let people = ref("215908人");
//获取画图节点
let charts = ref();
//echarts简单实现
onMounted(() => {
  let mycharts = echarts.init(charts.value);
  mycharts.setOption({
    //标题组件配置
    title: {
      text: "水球图",
    },
    //两轴组件
    xAxis: {},
    yAxis: {},
    //系列 决定展示什么样的组件
    series: {
      type: 'liquidFill',//系列
            data: [0.6, 0.4, 0.2],//展示的数据
            waveAnimation: true,//动画
            animationDuration: 3,
            animationDurationUpdate: 0,
            radius:"100%"
    },
    //布局
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });
});
</script>

<style lang="less" scoped>
.box {
  background: url("../../images/dataScreen-main-lb.png") no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    margin-left: 20px;
    .title {
      color: white;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url("../../images/dataScreen-title.png") no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: white;
      font-size: 20px;
      span {
        color: yellowgreen;
      }
    }
  }
  .number {
    margin-top: 30px;
    display: flex;
    padding: 10px;
    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url("../../images/total.png") no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      font-size: 20px;
    }
  }
  .charts {
    width: 100%;
    height: 250px;
  }
}
</style>
