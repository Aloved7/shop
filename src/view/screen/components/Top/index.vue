<template>
  <div class="top">
    <div class="left">
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">理塘旅游数据大屏</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">时间:{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";
import { useRouter } from "vue-router";
import { ref, onMounted, onBeforeUnmount } from "vue";
let router = useRouter();
//存储当前时间
let time = ref(moment().format("YYYY年MM月DD日 hh:mm:ss"));
let timer = ref<any>(0); //控制定时器的销毁

//点击首页跳转首页
const goHome = () => {
  router.push("/home");
};
//组件挂载完毕实时更新 时间
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format("YYYY年MM月DD日 hh:mm:ss");
  }, 1000);
});

onBeforeUnmount(() => {
  //销毁定时器
  clearInterval(timer.value)
});
</script>

<style scoped lang="less">
.top {
  color: #fff;
  width: 100%;
  height: 40px;
  display: flex;
  .left {
    flex: 1;
    background: url("../../images/dataScreen-header-left-bg.png") no-repeat;
    background-size: cover;
    .lbtn {
      font-size: 20px;
      width: 150px;
      height: 40px;
      float: right;
      background: url("../../images/dataScreen-header-btn-bg-l.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
    }
  }
  .center {
    flex: 2;
    .title {
      color: #29fcff;
      width: 100%;
      height: 74px;
      background: url("../../images/dataScreen-header-center-bg.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      font-size: 30px;
    }
  }
  .right {
    flex: 1;
    background: url("../../images/dataScreen-header-left-bg.png") no-repeat;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .rbtn {
      font-size: 20px;
      width: 150px;
      height: 40px;
      background: url("../../images/dataScreen-header-btn-bg-r.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      color: #29fcff;
    }
    .time {
      color: #29fcff;
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
</style>
