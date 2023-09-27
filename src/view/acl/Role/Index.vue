<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请输入职位" v-model="keywords"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keywords ? false : true"
          @click="search"
          >搜索</el-button
        >
        <el-button type="primary" @click="refresh">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px">
    <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
    <el-table border style="margin-top: 10px" :data="allRole">
      <el-table-column type="index" align="center" label="#"></el-table-column>
      <el-table-column align="center" label="ID" prop="id"></el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="职位名称"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="创建时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        align="center"
        show-overflow-tooltip
        label="更新时间"
        prop="updateTime"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="300px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setPermisstion(row)"
            >分配权限</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateRole(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.roleName}吗？`"
            width="260px"
            @confirm="deleteRoel(row)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @current-change="getHasRole"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 添加与更新的模态框 -->
  <el-dialog v-model="show" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :rules="rules" :model="RoleParams" ref="formRef">
      <el-form-item label="职位" prop="roleName">
        <el-input
          placeholder="请你输入职位名称"
          v-model="RoleParams.roleName"
        ></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- c抽屉组件  分配权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 
        树形控件
        data 展示的数据 必须是数组
        show-checkbox 节点是否被选中 是否有复选框
        node-key 每个节点的标识
        default-expanded-keys  默认展开对应节点key的数组 对应的就是id
        default-checked-keys 默认勾选的节点 
        :props="defaultProps" 有label 是展示的字段 children 展示子节点
        default-expand-all 默认展开素有子节点
     -->
      <el-tree
        ref="treeRef"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import {
  reqAllRoleList,
  reqAddOrUpdateRole,
  reqAllMenuList,
  reqSetPermission,
  reqRemoveRole,
} from "@/api/acl/role/index";
import {
  RoleResponseData,
  Records,
  RoleData,
  MenuList,
} from "@/api/acl/role/type";
import { ref, onMounted, reactive, nextTick } from "vue";
import useLayoutSettingStore from "@/store/modules/setting";
import { ElMessage } from "element-plus";
//获取仓库对象 去修改刷新与否
let layoutSettingStore = useLayoutSettingStore();
//页码
let pageNo = ref<number>(1);
//每页展示几条
let pageSize = ref<number>(5);
//搜索职位关键字
let keywords = ref<string>("");
//存储全部已有职位
let allRole = ref<Records>([]);
//职位总个数
let total = ref<number>(0);
//控制更行和添加的模态框
let show = ref<boolean>(false);
//收集新增职位数据
let RoleParams = reactive<RoleData>({
  roleName: "",
});
//获取表单实例
let formRef = ref<any>();
//控制抽屉组件的显示和隐藏
let drawer = ref<boolean>(false);
//定义数组 存储权限数据
let menuArr = ref<MenuList>([]);
//准备一个数组 存储过滤后的四级id
let selectArr = ref<number[]>([]);

//获取属性控件实例 然后调用组件自带方法 获得选中的id
let treeRef = ref<any>();

//请求方法封装
const getHasRole = async (pager = 1) => {
  pageNo.value = pager;
  let res: RoleResponseData = await reqAllRoleList(
    pageNo.value,
    pageSize.value,
    keywords.value
  );
  total.value = res.data.total;
  allRole.value = res.data.records;
};

//每页请求数据发生改变
const sizeChange = () => {
  getHasRole();
  keywords.value = "";
};

//重置按钮  需要获取仓库数据 对仓库数据进行操作
const refresh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh;
};

//搜索按钮
const search = () => {
  getHasRole();
};

//添加职位
const addRole = () => {
  show.value = true;
  //清空数据
  Object.assign(RoleParams, {
    roleName: "",
    id: "",
  });
  //清空错误提示
  nextTick(() => {
    formRef.value.clearValidate("roleName");
  });
};

//更新职位
const updateRole = (row: RoleData) => {
  show.value = true;
  //   console.log(row);
  //存储已有职位 然后进行更新
  Object.assign(RoleParams, row);
  //更新的错误也必须清除
  nextTick(() => {
    formRef.value.clearValidate("roleName");
  });
};

//添加用户表单校验规则
const validatorRoleName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack();
  } else {
    callBack(new Error("职位必须大于两位"));
  }
};
//校验对象
const rules = {
  roleName: [
    {
      required: true,
      trigger: "blur",
      validator: validatorRoleName,
    },
  ],
};

//表单验证通过后 提交给服务器
let save = async () => {
  await formRef.value.validate();
  //添加职位或这更新职位请求
  let res = await reqAddOrUpdateRole(RoleParams);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: RoleParams.id ? "更新成功" : "添加成功",
    });
    show.value = false;
    //重新获取全部职位
    getHasRole(RoleParams.id ? pageNo.value : 1);
  } else {
    ElMessage({
      type: "error",
      message: RoleParams.id ? "更新失败" : "添加失败",
    });
    show.value = false;
  }
};

onMounted(() => {
  getHasRole();
});

//分配权限按钮的回调  已有职位数据
const setPermisstion = async (row: RoleData) => {
  drawer.value = true;
  //收集当前要分配权限的职位数据
  Object.assign(RoleParams, row);
  //根据职位获取权限数据
  let res = await reqAllMenuList(RoleParams.id as number);

  if (res.code === 200) {
    menuArr.value = res.data;
    console.log(typeof menuArr.value);
    //定义一个方法 对全部权限进行过滤
    selectArr.value = filterSelectArr(menuArr.value, []);
  }
};
const filterSelectArr = (allData: any, initArr: any) => {
  //递归的去筛选四级列表中 被选中的
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id);
      //此时列表是空白的 因为到一级就停止了 所以就必须使用递归
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr);
    }
  });
  return initArr;
};

//给每个职位添加权限后 也就是 抽屉确认按钮的回调
const confirmClick = async () => {
  //职位id
  const roleId = RoleParams.id as number;
  console.log(roleId);

  //选中节点的id
  let arr = treeRef.value.getCheckedKeys();
  //半选中的id 就是选了但是没全选  需要半选中 是因为 获取选中节点只能获取 四级的
  let arr1 = treeRef.value.getHalfCheckedKeys();
  //合并两个数组 一起发送给服务器
  let permissionId = arr.concat(arr1);
  let res: any = await reqSetPermission(roleId, permissionId);
  if (res.code === 200) {
    //关闭抽屉
    drawer.value = false;
    ElMessage({
      type: "success",
      message: "分配权限成功",
    });
    //页面刷新  防止当前管理员 权限发生改变后 没有即使做出调整
    window.location.reload();
  }
};

//删除已有职位
const deleteRoel = async (row: any) => {
  let res: any = await reqRemoveRole(row.id);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //c重新获取
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};

//属性空间测试数据
const defaultProps = {
  children: "children",
  label: "name",
};
</script>

<style scoped lang="less">
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
