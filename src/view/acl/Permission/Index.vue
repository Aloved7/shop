<template>
  <el-table
    :data="permissionArr"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    border
  >
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row, $index }">
        <el-button
          type="primary"
          size="small"
          icon="User"
          :disabled="row.level === 4 ? true : false"
          @click="addPermission(row)"
          >{{ row.level === 3 ? "添加功能" : "添加菜单" }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="Edit"
          :disabled="row.level === 1 ? true : false"
          @click="updatePermission(row)"
          >编辑</el-button
        >
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="deleteMenu(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              icon="Delete"
              :disabled="row.level === 1 ? true : false"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- 对话框 进行添加或更新操作 -->
  <el-dialog
    v-model="dialogVisible"
    :title="menuData.id ? '更新菜单' : '添加菜单'"
  >
    <!-- 表单组件 -->
    <el-form label-width="100px">
      <el-form-item label="名称">
        <el-input
          placeholder="请你输入菜单名称"
          v-model="menuData.name"
        ></el-input>
      </el-form-item>
      <el-form-item label="权限值">
        <el-input placeholder="请你输入权限值" v-model="menuData.code">
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import {
  reqAllPermission,
  reqAddOrUpdateMenu,
  reqDeleteMenu,
} from "@/api/acl/menu/index";
import type {
  PermissionResponseData,
  PermisstionList,
  Permisstion,
  MenuParams,
} from "@/api/acl/menu/type";
import { ElMessage } from "element-plus";

//定义一个变量存储返回的数据 负责展示
let permissionArr = ref<PermisstionList[]>([]);
//控制对话框 显示和隐藏
let dialogVisible = ref<boolean>(false);

//收集添加和更新的参数
let menuData = reactive<MenuParams>({
  code: "", //权限
  level: 0,
  name: "", //菜单名字
  pid: 0, //对应已有菜单的id
});

//封装请求方法
const getHasPermission = async () => {
  let res: PermissionResponseData = await reqAllPermission();
  if (res.code === 200) {
    permissionArr.value = res.data;
  }
};

//添加菜单式事件
const addPermission = (row: Permisstion) => {
  //清空数据
  Object.assign(menuData, {
    id: 0, //必须清空id
    code: "", //权限
    level: 0,
    name: "", //菜单名字
    pid: 0, //对应已有菜单的id
  });
  dialogVisible.value = true;
  //收集id和层级
  menuData.level = row.level + 1;
  menuData.pid = (row.id as number);
};

//更新菜单
const updatePermission = (row: Permisstion) => {
  dialogVisible.value = true;
  //   console.log(row); 收集已有菜单的数据
  Object.assign(menuData, row);
};

//确定按钮发送请求
const save = async () => {
  let res: any = await reqAddOrUpdateMenu(menuData);
  if (res.code === 200) {
    //关闭对话框
    dialogVisible.value = false;
    //重新获取数据
    getHasPermission();
    //提示
    ElMessage({
      type: "success",
      message: menuData.id ? "更新成功" : "添加成功",
    });
  } else {
    dialogVisible.value = false;
    ElMessage({
      type: "success",
      message: menuData.id ? "更新失败" : "添加失败",
    });
  }
};

//删除事件
const deleteMenu = async (id: number) => {
  let res = await reqDeleteMenu(id);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getHasPermission();
  } else {
    ElMessage({
      type: "success",
      message: "删除失败",
    });
    getHasPermission();
  }
};

onMounted(() => {
  //挂载后获取已有数据
  getHasPermission();
});
</script>

<style scoped></style>
