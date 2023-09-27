<template>
  <div class="box4" ref="map">地图</div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
//引入地图数据
import ChinaJson from "./map.json";
let map = ref();
//注册 echarts中国地图
echarts.registerMap("china", ChinaJson as any);
onMounted(() => {
  let myechts = echarts.init(map.value);
  //地图配置项
  myechts.setOption({
    //创建地图
    geo: {
      map: "china",
      roam: true,
      //地图位置适配
      left: 50,
      top: 90,
      right: 20,
      bottom: 50,
      //地图上文字
      label: {
        show: true,
      },
      itemStyle: {
        //每一个多边形的样式
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "red", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      //地图高亮效果
      emphasis: {
        itemStyle: {
          color: "red",
        },
        label: {
          //   fontSize: 40,
          color: "white",
          fontSize: 20,
        },
      },
    },
    series: [
      {
        type: "lines", //航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "orange",
              width: 5,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "yellow",
              width: 5,
            },
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          symbol: "arrow",
          color: "black",
          symbolSize: 10,
        },
      },
    ],
  });
});
</script>

<style scoped lang="less">
.box4 {
}
</style>
