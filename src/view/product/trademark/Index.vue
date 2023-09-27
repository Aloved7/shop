<template>
  <el-card class="box-card">
    <!-- 通过具名插槽来定制card -->
    <el-button
      type="primary"
      size="default"
      icon="Plus"
      @click="addTrademark"
  
      >添加品牌</el-button
    >
    <!-- 表格组件 用于展示 已有品牌  column代表列-->
    <!-- border 标识纵向边框 :data 动态展示数据 -->
    <el-table
      max-height="540px"
      style="margin: 10px 0px"
      border
      :data="tardemarkArr"
    >
      <!-- 列元素属性 type 如果为index 则从1开始的索引 
        prop 字段会将表单头部绑定的data中的对应字段展示
        el-table-column 默认展示数据使用div  如果不想使用就用插槽
      -->
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <!-- 触发点击事件时 将行数据传入 然后在修改的模态框内部展示出来 -->
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTrademark(row)"
          ></el-button>

          <el-popconfirm
            :title="`您确定要删除${row.tmName}?`"
            width="250"
            icon="Delete"
            @confirm="removeTrademark(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器
        相应属性：
        current-page 分页器当前页码
        page-size 每页显示多少条数据
        page-sizes 控制下方的选择器每次取多少条数据
        small  是否使用小型的分页器
        background 是否为分页器按钮添加颜色
        layout  控制分页器子组件的布局 -> 将子组件顶到最右边
    
    -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="getHasTrademark"
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes, total,"
      :total="total"
    />
  </el-card>
  <!-- 对话框组件 添加修改使用-->
  <!-- 
    v-model 控制对话框显示与否
    title 对话框标题

   -->
  <el-dialog
    v-model="isSHow"
    :title="trademarkParams.id ? '修改品牌' : '添加品牌'"
  >
    <!-- model 数据绑定到了谁身上 然后才能开启校验规则 ref="formRef 是为了获取表单项然后进行整体验证-->
    <el-form
      ref="formRef"
      style="width: 60%"
      :model="trademarkParams"
      :rules="rules"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请输入品牌名"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
        <!-- 
          action 请求的url
          show-file-list 是否显示文件上传列表
          before-upload 文件上传之前的钩子函数  会注入当前上传的文件 可以约束上传文件的类型
         -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <!-- 如果将要传给服务器的参数里有图片路径 就显示 -->
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <!-- 底部传入具名插槽 定制底部 -->
    <template #footer>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
      <el-button size="default" @click="cancal">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
//导入上传的ts类型
import { ElMessage, type UploadProps } from "element-plus";
import { ref, onMounted, reactive, nextTick } from "vue";
import {
  reqAddOrUpdateTrademark,
  reqHasTrademark,
  reqDeleteTrademark,
} from "@/api/product/tardemark";
import { Trademark } from "@/api/product/tardemark/type";
import type {
  Records,
  TrademarkResponseData,
} from "@/api/product/tardemark/type";

let pageNo = ref<number>(1); //当前页码
let limit = ref<number>(3); //每页展示多少条数据
//获取数据后 定义总条数
let total = ref<number>(0);
//获取数据后 存储已有品牌的数据 records 是个数组 存储的是没一页的数据
let tardemarkArr = ref<Records>([]);
//控制对话框显示
let isSHow = ref(false);

//定义新增品牌的数据
let trademarkParams = reactive<Trademark>({
  tmName: "",
  logoUrl: "",
});

//获取已有品牌的封装
const getHasTrademark = async (pager = 1) => {
  /*
    当改变每页请求的条数时  不会回到第一页 所以必须强制回到第一页
    给一个参数 pager = 1
    让页码归一
    pageNo.value = pager
  */
  //让其页码强制归一
  pageNo.value = pager;
  let res: TrademarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value
  );
  // console.log(res);
  if (res.code === 200) {
    //存储总条数
          total.value = res.data.total;
    //存储已有品牌数据
    tardemarkArr.value = res.data.records;
  }
};

//分页器当前页码发生变化的时候 触发  也可以直接把请求当作回调函数方入
// const changePageNo = () => { //函数默认接收当前页码
//   // console.log(123);  重新发送请求 并且携带当前的页码
//   getHasTrademark();
// };

//当每一页加载数据条数发生变化的时候
const sizeChange = () => {
  // pageNo.value = 1
  getHasTrademark();
};

//添加品牌事件
const addTrademark = () => {
  isSHow.value = true;
  // 只要一点击添加按钮 直接清空 不用再在下面的取消确定按钮中再书写
  //不管成功与否 都必须清空数据
  trademarkParams.id = 0; //不清空id 模态框标题无法更改
  trademarkParams.tmName = "";
  trademarkParams.logoUrl = "";

  //由于模态框内部的表单是共享的 当上一次出错点击取消后 错误仍然会保存 需要清理
  //但是 第一次点开模态框的时候 去验证是验证不到的 因为DOM的创建时异步的 此时进行验证 from还未创建 无法清除
  //第一种方法 ts 语法中的可选参数
  // formRef.value?.clearValidate("tmName");
  // formRef.value?.clearValidate("logoUrl");

  //第二种方法 nextTick DOM刷新后立即调用
  nextTick(() => {
    //此时就可以获取表单的DOM 对象
    formRef.value?.clearValidate("tmName");
    formRef.value?.clearValidate("logoUrl");
  });
};

//修改品牌事件
const updateTrademark = (row: Trademark) => {
  // console.log(row); row 就是当前已有的品牌 直接赋值给v-model 的数据就可以展示
  Object.assign(trademarkParams, row); //合并数据
  // trademarkParams.id = row.id; //带上id 去进行修改的判断
  // trademarkParams.tmName = row.tmName;
  // trademarkParams.logoUrl = row.logoUrl;
  isSHow.value = true;

  //修改按钮也必须清空错误提示
  //由于模态框内部的表单是共享的 当上一次出错点击取消后 错误仍然会保存 需要清理
  //但是 第一次点开模态框的时候 去验证是验证不到的 因为DOM的创建时异步的 此时进行验证 from还未创建 无法清除
  //第一种方法 ts 语法中的可选参数
  // formRef.value?.clearValidate("tmName");
  // formRef.value?.clearValidate("logoUrl");

  //第二种方法 nextTick DOM刷新后立即调用
  nextTick(() => {
    //此时就可以获取表单的DOM 对象
    formRef.value?.clearValidate("tmName");
    formRef.value?.clearValidate("logoUrl");
  });
};

//确定和取消按钮
const cancal = () => {
  isSHow.value = false;
  //不管成功与否 都必须清空数据
  // trademarkParams.tmName = "";
  // trademarkParams.logoUrl = "";
};
const confirm = async () => {
  //对整个表单进行校验 对整个表单的内容进行验证。 接收一个回调函数，或返回 Promise。
  await formRef.value.validate(); //所有校验成功之后 再进行上传
  //调用请求函数 带上参数 发送请求 修改数据库
  let res: any = await reqAddOrUpdateTrademark(trademarkParams);
  // console.log(res,'@@@@@');
  if (res.code === 200) {
    //成功
    ElMessage({
      type: "success",
      message: trademarkParams.id ? "修改品牌成功" : "添加品牌成功",
    });
    //成功之后 调用函数刷新总条数  因为从新调用 但是pager没有赋值 所以会跳转到第一页 必须根据id判断
    getHasTrademark(trademarkParams.id ? pageNo.value : 1);
  } else {
    //失败
    ElMessage({
      type: "error",
      message: trademarkParams.id ? "修改品牌失败" : "添加品牌失败",
    });
  }
  isSHow.value = false;
  //不管成功与否 都必须清空数据
  // trademarkParams.tmName = "";
  // trademarkParams.logoUrl = "";
};

//文件上传前调用的钩子函数
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  // console.log(rawFile); //上传当前文件的对象 对上传的文件进行约束和限制
  if (
    rawFile.type === "image/png" ||
    rawFile.type === "image/jpeg" ||
    rawFile.type === "image/gif"
  ) {
    if (rawFile.size / 10247 / 1024 < 4) {
      return true;
    } else {
      ElMessage({
        type: "error",
        message: "文件上传大小小于4M",
      });
    }
  } else {
    ElMessage({
      type: "error",
      message: "文件上传格式务必是PNG|JPEG|GIF",
    });
    return false;
  }
};

//文件上传成功调用的钩子函数
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response, //为上传图片请求返回的图片路径
  uploadFile //图片的信息
) => {
  console.log(response.data);
  //将 返回的图片路径 赋值给trademarkParams 将来发请求的时候带上
  trademarkParams.logoUrl = response.data;
  //将上传文件报错清空
  //clearValidate	清理某个字段的表单验证信息。
  formRef.value.clearValidate("logoUrl");
};

//表单校验方法
//获取表单实例对象
let formRef = ref(); //必须在confirm也就是发请求前 对整个表单进行校验
//品牌验证
const validatorTmName = (rule: any, value: any, callback: any) => {
  // console.log(123);
  if (value.trim().length >= 2) {
    callback();
  } else {
    callback(new Error("品牌名称必须大于等于两位"));
  }
};
//logo验证
const validatorLogo = (rule: any, value: any, callback: any) => {
  //此时的value 是图片的地址
  if (value) {
    //图片已经上传
    callback();
  } else {
    callback(new Error("logo图片务必上传"));
  }
};

//模态框内部表单校验规则
const rules = {
  tmName: [
    //trigger 触发的时机得带上双引号
    {
      required: true,
      trigger: "blur",
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      trigger: "change",
      validator: validatorLogo,
    },
  ],
};

//删除行数据方法  气泡确认框
const removeTrademark = async (id: number) => {
  let res = await reqDeleteTrademark(id);

  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //删除成功后需要进行判断 是否停留在当前页码
    getHasTrademark(
      tardemarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1
    );
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

onMounted(() => {
  //调用亲求方法 获取第一页 一页有三个已有品牌
  getHasTrademark();
});
</script>
<script lang="ts">
export default {
  name: "trademark",
};
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
