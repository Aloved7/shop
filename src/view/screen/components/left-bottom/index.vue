<template>
  <div class="box2">
    <div class="title">
      <p>年龄比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <!-- 图形图表 -->
    <div class="echarts" ref="echats"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
let echats = ref();
onMounted(() => {
  let myecharts = echarts.init(echats.value);
  //设置配置项  赋值来配置对象 然后进行设置
  let option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: 40,
      right:10,
      //图例组件 竖向排列
      orient: "vertical",
      textStyle:{
        color:'white',
        fonSize:'14'
      }
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          color:'white'
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: "军事" },
          { value: 735, name: "新闻" },
          { value: 580, name: "直播" },
          { value: 484, name: "娱乐" },
          { value: 300, name: "财经" },
        ],
      },
    ],
    //调整布局 充满容器
    grid: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  };
  //进行设置
  myecharts.setOption(option);
});
</script>

<style scoped lang="less">
.box2 {
  width: 100%;
  height: 100%;
  background-color: red;
  background: url("../../images/dataScreen-main-cb.png") no-repeat;
  background-size: 100% 100%;
  .title {
    color: white;
    font-size: 20px;
    margin: 0 20px;
  }
  .echarts {
    height: 260px;
  }
}
</style>
