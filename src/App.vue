<template>
  <el-config-provider :locale="locale">
    <router-view />
  </el-config-provider>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { Login } from "@/api/user";
import { ElConfigProvider } from "element-plus";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";

export default defineComponent({
  components: {
    ElConfigProvider,
  },
  setup() {
    onMounted(() => {
      Login({ username: "admin", password: "111111" });
    });

    return {
      locale: zhCn,
    };
  },
});
</script>

<style scoped></style>
