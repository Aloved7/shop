<template>
  <div class="box1">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="sex">
      <div class="man">
        <img src="../../images/man.png" alt="" />
      </div>
      <div class="women">
        <img src="../../images/woman.png" alt="" />
      </div>
    </div>
    <div class="rate">
      <p>男士58%</p>
      <p>女士42%</p>
    </div>
    <!-- 图形图表 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
let charts = ref();
onMounted(() => {
  //初始化echarts
  let myecharts = echarts.init(charts.value);
  //绘画图形
  myecharts.setOption({
    title: {
      text: "男女比例",
      textStyle: {
        //主标题颜色
        color: "skyblue",
      },
      left: "40%",
    },
    xAxis: {
      show: false, //轴不显示
      //   type: "category",
      //水平轴上均匀分配
      min: 0, //最小位置
      max: 100, //最大位置
    },
    yAxis: {
      show: false,
      type: "category",
    },
    series: [
      {
        type: "bar",
        data: [58],
        barWidth: 20,
        z:100, //提升可视化优先级 覆盖女条
        itemStyle:{
            color:'skyblue',
            borderRadius:20
        }
    },
      {
        type: "bar",
        data: [100],
        barWidth: 20,
        //调整女条 被男条覆盖
        barGap:'-100%',
        itemStyle:{
            color:'pink',
            borderRadius:20
        }
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  });
});
</script>

<style scoped lang="less">
.box1 {
  width: 100%;
  height: 100%;
  background: url("../../images/dataScreen-main-cb.png") no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  .title {
    color: white;
    font-size: 20px;
    margin: 0 20px;
  }
  .sex {
    display: flex;
    justify-content: center;
    align-items: center;
    .man {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url("../../images/man-bg.png");
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      background: url("../../images/woman-bg.png");
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .rate {
    color: white;
    display: flex;
    justify-content: space-between;
    p{
        margin: 10px;
    }
  }
  .charts {
    height: 100px;
  }
}
</style>
