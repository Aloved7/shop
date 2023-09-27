<template>
  <div class="login-container">
    <el-row>
      <!-- 当屏幕分辨率小于768 时 xs生效 -->
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login-form"
          :model="loginForm"
          :rules="rules"
          ref="Forms"
        >
          <h1>Hello</h1>
          <h2>欢迎进入丁真五代</h2>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="Please input">
              <template #prefix>
                <el-icon class="el-input__icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <!-- props 是声明 需要校验的表单 -->
            <el-input
              v-model="loginForm.password"
              placeholder="Please input"
              type="password"
              show-password
            >
              <template #prefix>
                <el-icon class="el-input__icon"><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              style="
                 {
                  width: 100%;
                }
              "
              :loading="isLoading"
              type="primary"
              size="default"
              @click="handleClick"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { User, Lock } from "@element-plus/icons-vue";
import userStore from "@/store/modules/user";
import { useRouter, useRoute } from "vue-router";
import { ElNotification } from "element-plus";
import { getTime } from "@/utils/time";

export default defineComponent({
  setup() {
    const router = useRouter();
    const route = useRoute();
    const isLoading = ref(false);
    //收集表单数据
    const loginForm = reactive({ username: "admin", password: "atguigu123" });
    let useS = userStore();

    //登录事件
    //获取表单组件 即表单内所有内容
    let Forms = ref();
    const handleClick = async () => {
      await Forms.value.validate();
      // 这个函数会返回一个promise对象 成功的话处于成功阶段 会被await接收 失败的话请求不会发送
      isLoading.value = true;
      try {
        await useS.userLogin(loginForm);
        //判断登录的时候 是否有query参数
        let redirect: any = route.query.redirect;
        router.push({ path: redirect || "/" });
        ElNotification({
          type: "success",
          message: "欢迎回来",
          title: `HI,${getTime()}好`,
        });
        isLoading.value = false;
      } catch (err) {
        ElNotification({
          type: "error",
          message: (err as Error).message,
        });
        isLoading.value = false;
      }
    };

    //自定义表单验证函数
    const vaildatorUserName = (rule: any, value: any, callback: any) => {
      //rule //校验规则对象 value 表单文本内容
      // console.log(rule,'rule');
      // console.log(value,'value'),
      // console.log(callback)   回调函数 如果正确直接callback往下走 如果错误就callback抛出错误信息
      if (value.length >= 5) {
        callback();
      } else {
        callback(new Error("用户名不能小于五位"));
      }
    };
    const vaildatorPassword = (rule: any, value: any, callback: any) => {
      if (value.length >= 6) {
        callback();
      } else {
        callback(new Error("密码不能小于6位"));
      }
    };
    const rules = {
      //#region
      // username: [
      //   {
      //     required: true,
      //     message: "请输入用户名",
      //     trigger: "blur",
      //   },
      //   {
      //     required: true,
      //     min: 5,
      //     max: 10,
      //     message: "账号的长度在6-10之间",
      //     trigger: "change",
      //   },
      // ],
      //#endregion
      username: [
        {
          trigger: "change",
          validator: vaildatorUserName,
        },
      ],
      password: [
        {
          trigger: "change",
          validator: vaildatorPassword,
        },
      ],
    };

    return {
      handleClick,
      isLoading,
      loginForm,
      rules,
      Forms,
    };
  },
});
</script>

<style scoped lang="less">
.login-container {
  width: 100%;
  height: 100vh;
  // background: red
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
  .login-form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 40px;
    .el-button {
      width: 100%;
    }
  }
  h1 {
    color: white;
    font-size: 40px;
  }
  h2 {
    font-size: 20px;
    color: white;
    margin: 20px 0;
  }
}
</style>
