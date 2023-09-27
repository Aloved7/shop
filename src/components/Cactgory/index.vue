<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handleChange"
        >
          <!-- label 是展示的数据  value 是下拉菜单收集的数据-->
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handleChangeTwo"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="categoryStore.c3Id"
        >
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
//引入分类仓库
import useCategoryStore from "@/store/modules/category";
let categoryStore = useCategoryStore();

//接收父组件传来的判断值
defineProps(["scene"]);

//一旦挂载完毕就加载一级路由
onMounted(() => {
  getC1();
});

//通知仓库获取一级分类
const getC1 = async () => {
  categoryStore.getC1();
};

//当一级分类被选择或者改变时 触发
const handleChange = () => {
  //发生改变时 清空 二级分类id 三级分类数组 三级分类id
  categoryStore.c2Id = "";
  categoryStore.c3Id = "";
  categoryStore.c3Arr = [];
  categoryStore.getC2();
};

//当二级分类被选择时 触发
const handleChangeTwo = () => {
  // console.log(123);
  //当二级发生变化时 清理掉c3 的id
  categoryStore.c3Id = "";
  categoryStore.getC3();
};
</script>

<style lang="scss" scoped></style>
