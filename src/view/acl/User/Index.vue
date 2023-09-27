<template>
  <el-card style="height: 80px">
    <el-form class="formItem">
      <el-form-item label="用户名">
        <el-input placeholder="请输入用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keyword ? false : true"
          @click="search"
          >搜索</el-button
        >
        <el-button type="primary" @click="refresh">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin-top: 10px">
    <el-button type="primary" @click="addUser">添加用户</el-button>
    <el-button
      type="primary"
      :disabled="selectIdArr.length > 0 ? false : true"
      @click="deleteSelect"
      >批量删除</el-button
    >
    <!-- 展示用户信息 -->
    <el-table
      style="margin-top: 10px"
      border
      :data="userArr"
      @selection-change="selectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column align="center" label="#" type="index"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="ID"
        prop="id"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="用户名字"
        prop="username"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="用户名称"
        prop="name"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="用户角色"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="创建时间"
        prop="createTime"
      ></el-table-column>
      <el-table-column
        show-overflow-tooltip
        align="center"
        label="更新时间"
        prop="updateTime"
      ></el-table-column>
      <el-table-column align="center" label="操作" width="300px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
            >分配角色</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.username}吗`"
            width="260px"
            @confirm="deleteUser(row.id)"
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
      @current-change="getHasUser"
      @size-change="handle"
    />
  </el-card>
  <!-- 添加一个抽屉效果 用来添加或者修改用户 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? "更新用户" : "添加用户" }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="!userParams.id" label="用户密码" prop="password">
          <el-input
            placeholder="请输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="save">确认</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 分配角色的抽屉组件 -->
  <el-drawer v-model="drawer2">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="check"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="userRole"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="(item, index) in allRole"
              :key="index"
              :label="item"
              >{{ item.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer2 = false">取消</el-button>
        <el-button type="primary" @click="handleClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  getUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  selectUser,
} from "@/api/acl/user/index";
import {
  UserReponseData,
  Records,
  User,
  AllRoleResponseData,
  AllRole,
  SetRoleData,
} from "@/api/acl/user/type";
import { ElMessage } from "element-plus";
import useLayoutSettingStore from "@/store/modules/setting";
//获取仓库对象 去修改刷新与否
let layoutSettingStore = useLayoutSettingStore();
//页码
let pageNo = ref<number>(1);
//每页展示几条
let pageSize = ref<number>(7);
//一下数据负责展示
let total = ref<number>(0); //总条数
let userArr = ref<Records>([]); //用户
//控制抽屉显示和隐藏
let drawer = ref<boolean>(false);
//控制分配角色的显示和隐藏
let drawer2 = ref<boolean>(false);

//收集参数 用来添加或者更新
let userParams = reactive<User>({
  username: "",
  name: "",
  password: "",
});

//获取form组件实例对象 然后对整个表单进行验证
let formRef = ref<any>();

//定义标单验证
//校验用户名字
const validatorUserName = (rule: any, value: any, callBack: any) => {
  // 长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户名字至少五位"));
  }
};
//校验用户昵称
const validatorName = (rule: any, value: any, callBack: any) => {
  // 长度至少五位
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户昵称至少五位"));
  }
};
//校验密码
const validatorPwd = (rule: any, value: any, callBack: any) => {
  // 长度至少五位
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error("用户昵称至少六位"));
  }
};

//表单验证对象
const rules = {
  //用户名字
  username: [
    {
      required: true,
      trigger: "blur",
      validator: validatorUserName,
    },
  ],
  //用户昵称
  name: [
    {
      required: true,
      trigger: "blur",
      validator: validatorName,
    },
  ],
  //用户密码
  password: [
    {
      required: true,
      trigger: "blur",
      validator: validatorPwd,
    },
  ],
};

//封装一个请求方法  获取已有账号展示
const getHasUser = async (pager = 1) => {
  pageNo.value = pager; //用来页码定位
  let res: UserReponseData = await getUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value
  );
  if (res.code === 200) {
    total.value = res.data.total;
    userArr.value = res.data.records;
  }
};

//添加用户
const addUser = () => {
  drawer.value = true;
  //每次都清空数据
  Object.assign(userParams, {
    id: "", //更新的时候会把id 赋值给userparams 但是清空数据时没有清空id 所以此处必须清空id
    username: "",
    name: "",
    password: "",
  });
  //获取form组件实例 清空某个字段的表单验证错误信息
  nextTick(() => {
    formRef.value.clearValidate("username");
    formRef.value.clearValidate("name");
    formRef.value.clearValidate("password");
  });
};

//模态框保存按钮 添加用户回调
const save = async () => {
  //点击确定后 必须保证表单符合条件发送请求
  await formRef.value.validate();
  //添加或者更新
  let res = await reqAddOrUpdateUser(userParams);
  // console.log(res);
  if (res.code === 200) {
    drawer.value = false;
    ElMessage({
      type: "success",
      message: userParams.id ? "更新成功" : "添加成功",
    });
    //获取最新数据  以及更新后页码
    getHasUser(userParams.id ? pageNo.value : 1);
    //成功后 浏览器自动刷新一次 以防更改自己的用户数据
    window.location.reload();
  } else {
    drawer.value = false;
    ElMessage({
      type: "error",
      message: userParams.id ? "更新失败" : "添加失败",
    });
  }
};

//更新用户
const updateUser = (row: User) => {
  drawer.value = true;
  //存储 已有的用户信息 赋值给userparams即可
  Object.assign(userParams, row);
  //点击编辑按钮进行更新的时候 也需要将表单验证规则删掉
  nextTick(() => {
    formRef.value.clearValidate("username");
    formRef.value.clearValidate("name");
  });
};

//分页器下拉菜单回调
const handle = () => {
  getHasUser();
};

onMounted(async () => {
  getHasUser();
});

//角色复选框
//控制 全选的确定与否
let check = ref<boolean>(false);
//控制不确定时的样式  选了 但是没有全选的样式
let isIndeterminate = ref<boolean>(true);
//默认值  当前已有职位
let userRole = ref<AllRole>([]); //v-model绑定后 负责展示和收集
//所有职位
let allRole = ref<AllRole>([]);

//收集输入的关键字
let keyword = ref<string>("");

//搜索发送请求
const search = () => {
  //根据关键字获取相应的用户信息
  getHasUser();
  //清空关键字
  keyword.value = "";
};
//重置按钮
const refresh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh;
};

//分配角色的回调
const setRole = async (row: User) => {
  drawer2.value = true;
  //存储用户信息 然后负责展示
  Object.assign(userParams, row);
  //调用接口 获取全部列表和 每个角色已有角色
  let res: AllRoleResponseData = await reqAllRole(row.id as number);

  if (res.code === 200) {
    allRole.value = res.data.allRolesList;
    userRole.value = res.data.assignRoles;
  }
};
//分配角色却确定方法
const handleClick = async () => {
  //收集参数
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number;
    }),
  };
  let res: any = await reqSetUserRole(data);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "分配成功",
    });
    //关闭抽屉
    drawer2.value = false;
    //重新获取信息  更新完之后必须留在当前页码
    getHasUser(pageNo.value);
  }
};

//删除角色方法
const deleteUser = async (userId: number) => {
  let res: any = await reqRemoveUser(userId);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};

//准备数组 发送删除多个请求
let selectIdArr = ref<User[]>([]);
//删除多个方法 复选框勾选触发 获取数据
const selectionChange = (row: any) => {
  // console.log(row);
  selectIdArr.value = row;
};
//批量删除
const deleteSelect = async () => {
  //整理批量删除数据
  let idList: any = selectIdArr.value.map((item) => {
    return item.id;
  });
  // console.log(idList);
  let res: any = await selectUser(idList);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};

//全选框的事件
const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : [];
  isIndeterminate.value = false;
};

//复选框改变时触发
const handleCheckedCitiesChange = (value: string[]) => {
  //会获取当前复选框组的数据
  const checkedCount = value.length;
  check.value = checkedCount === allRole.value.length;
  //复选框不确定样式
  isIndeterminate.value = checkedCount === allRole.value.length ? false : true;
};
</script>

<style scoped lang="less">
.formItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
