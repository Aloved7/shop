<template>
  <el-card>
    <div class="box">
      <img :src="user.avatar" alt="" class="avatar" />
      <div class="bottom">
        <h3 class="title">{{ getTime() }}好{{ user.username }}</h3>
        <p class="subtitle">丁真甄选平台</p>
      </div>
    </div>
  </el-card>
  <div class="img">
    <svg-icon name="welcome" width="500px" height="500px"></svg-icon>
  </div>
</template>

<script setup lang="ts">
//引用处理时间方法
import { getTime } from "@/utils/time";
//引入用户相关的仓库
import userStore from "@/store/modules/user";
let user = userStore();
</script>

<style scoped lang="less">
.box {
  display: flex;
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .bottom {
    margin-left: 20px;
    .title {
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .subtitle {
      font-style: italic;
      color: skyblue;
    }
  }
}
.img {
  display: flex;
  justify-content: center;
}
</style>
