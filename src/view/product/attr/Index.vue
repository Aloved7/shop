<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Cactgory :scene="scene"></Cactgory>
    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          @click="changeShow"
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          >添加属性</el-button
        >
        <!-- 如果第三个分类有id 就不禁用这个按钮 -->
        <el-table
          border
          style="margin: 10px 0"
          :data="attArr"
          max-height="480px"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag
                style="margin: 5px"
                v-for="(item, index) in row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px">
            <template #="{ row, $index }">
              <el-button
                size="small"
                type="primary"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <!-- <el-button
                size="small"
                type="primary"
                icon="Delete"
                @click="deleteArr(row.id)"
              ></el-button> -->
              <el-popconfirm
                :title="`你确定要删除${row.attrName}?`"
                @confirm="deleteArr(row.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" icon="Delete" ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性和修改属性 -->
      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性的名称"
              v-model="attrPamams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrPamams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button size="default" @click="cancleShow">取消</el-button>
        <el-table
          :data="attrPamams.attrValueList"
          border
          style="margin: 20px 0"
        >
          <el-table-column
            label="序号"
            width="80px"
            type="index"
            align="center"
          ></el-table-column>
          <el-table-column label="属性值的名称">
            <template #="{ row, $index }">
              <!--  :ref="(vc:any) => inputArr[$index]=vc"将当前input对象 推入input数组中 -->
              <el-input
                :ref="(vc:any) => inputArr[$index]=vc"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                size="small"
                placeholder="请输入属性值名称"
                v-model="row.valueName"
              ></el-input>
              <div @click="toEdit(row, $index)" v-else>{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值的操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                :icon="Delete"
                @click="attrPamams.attrValueList.splice($index)"
              >
                <!-- 通过角标删除 每一条数据 -->
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="svae"
          :disabled="attrPamams.attrValueList.length > 0 ? false : true"
          >保存</el-button
        >
        <!-- 防止 空属性也可以提交 将按钮设置为禁用  根据属性的数组进行动态解绑 -->
        <el-button size="default" @click="cancleShow">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
//引入watch 进行监听
import { watch, ref, reactive, nextTick ,onBeforeUnmount} from "vue";
//引入已有属性 得接口方法
import { reqArr, reqAddOrUpdate, reqRemoveArr } from "@/api/product/attr/index";
//引入约束类型
import { AttrResponseData, Attr } from "@/api/product/attr/type";
//获取 分类的仓库类型
import useCategoryStore from "@/store/modules/category";
import { ElMessage } from "element-plus";
import { Delete } from "@element-plus/icons-vue";
let categoryStore = useCategoryStore();

//收集新增的属性数据
let attrPamams = reactive<Attr>({
  attrName: "", //新增属性的名字
  attrValueList: [
    //新增的属性有什么属性 比如说 颜色里有紫色
    // {
    //   valueName:''
    // }
  ],
  categoryId: "", //对应三级分类的id
  categoryLevel: 3, //对应的分类
});

//存储已有得属性和属性值  返回得数据
let attArr = ref<Attr[]>([]);

//控制添加得 条件渲染
let scene = ref<number>(0);

//定义一个变量 去控制编辑模式和查看模式的切换
// let flag = ref<boolean>(true);

//准备一个数组 存包处input 实例
let inputArr = ref<any>([]); //通过ref函数写法 将每个实例推入到inputArr中

//监听仓库三级分类id得变化
watch(
  () => categoryStore.c3Id,
  async () => {
    //必须清空上一次得属性值
    attArr.value = [];
    // console.log(123);
    //只有三级id 有才能去请求数据
    if (!categoryStore.c3Id) return;
    getAttr();
  }
);

//请求属性得方法
const getAttr = async () => {
  //获取分类得id 三个id
  const { c1Id, c2Id, c3Id } = categoryStore;
  // console.log(c1Id, c2Id, c3Id);
  let res: AttrResponseData = await reqArr(c1Id, c2Id, c3Id);
  console.log(res); //存储已有得属性和属性值
  if (res.code === 200) {
    attArr.value = res.data;
  }
};

//条件渲染方法  添加方法
const changeShow = () => {
  //每一次点击 都先清空原有的数据
  Object.assign(attrPamams, {
    attrName: "", //新增属性的名字
    attrValueList: [
      //新增的属性有什么属性 比如说 颜色里有紫色
      // {
      //   valueName:''
      // }
    ],
    categoryId: categoryStore.c3Id, //对应三级分类的id
    categoryLevel: 3, //对应的分类
  });
  scene.value = 1;
  //收集参数  可以点击这个按钮的时候 就意味着 三级分类的id已经获取了
  // attrPamams.categoryId = categoryStore.c3Id;  利用对象合并 已经收集到了相应的数据
};

//修改方法
const updateAttr = (row: Attr) => {
  scene.value = 1;
  //展示已有数据  赋值给attrParams
  //浅拷贝的坑
  //可以发现 当添加属性 但是并没有保存之后 展示列表仍然生成了新属性 而且没有发请求
  //这是因为assign 将他们合并成一个对象 并且覆盖了原本的对象 所以必须得用深拷贝 让其产生一个新对象
  //互不影响
  Object.assign(attrPamams, JSON.parse(JSON.stringify(row)));
};

//取消按钮
const cancleShow = () => {
  scene.value = 0;
};

//添加属性值的方法
const addAttrValue = () => {
  // alert(123)  当事件触发的时候 就必须像 :data="attrPamams.attrValueList" 添加对象
  attrPamams.attrValueList.push({
    valueName: "",
    //添加的时候 多添加一个属性 用来控制编辑模式和查看模式的切换
    flag: true,
  });
  //获取最后的input框 并获取焦点  每次添加的时候都i获取焦点
  nextTick(() => {
    inputArr.value[attrPamams.attrValueList.length - 1].focus();
  });
};

//参数已经在上面收集完毕 发送请求即可
const svae = async () => {
  //添加请求
  let res: any = await reqAddOrUpdate(attrPamams);
  if (res.code === 200) {
    //添加或者修改成功
    scene.value = 0; //切换场景
    ElMessage({
      type: "success",
      message: attrPamams.id ? "修改成功" : "添加成功",
    });
    //成功后重新获取全部已有数据
    getAttr();
  } else {
    ElMessage({
      type: "error",
      message: attrPamams.id ? "修改失败" : "添加失败",
    });
  }
};

//#region
//当属性变多的时候 并没有合理解决
//属性值表单元素失去焦点之后  切换查看模式与编辑模式
// const toLook = () => {
//   flag.value = false;
// };

// //点击div的时候 切换为编辑模式
// const toEdit = () => {
//   flag.value = true;
// };
//#endregion

//属性值表单元素失去焦点之后  切换查看模式与编辑模式
const toLook = (row: any, $index: number) => {
  //当失去焦点的时候 输入框内的值为空 是不能跳转的
  if (row.valueName.trim() === "") {
    //为空 删除对应的属性值
    attrPamams.attrValueList.splice($index);
    ElMessage({
      type: "error",
      message: "属性值不能为空",
    });
    return;
  }
  //当重复添加属性的时候不允许
  let res: any = attrPamams.attrValueList.find((item) => {
    if (item !== row) {
      return item.valueName === row.valueName;
    }
  });
  //如果有重复的不能变成div
  if (res) {
    ElMessage({
      type: "error",
      message: "不能出现重复属性",
    });
    //删除出数组
    attrPamams.attrValueList.splice($index);
    return;
  }
  row.flag = false;
};

// //点击div的时候 切换为编辑模式
const toEdit = (row: any, $index: number) => {
  row.flag = true; //由于dom对象被切换 所以获取的数据是null
  //点击div的时候获取焦点
  nextTick(() => {
    // console.log(inputArr.value[$index]);
    inputArr.value[$index].focus();
  });
};

// const handle = () => {
//   console.log(123);
// };

//删除已有属性
const deleteArr = async (attrId: number) => {
  let res = await reqRemoveArr(attrId);
  console.log(res);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //删除成功之后 重新获取属性值
    getAttr();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

//组件销毁的时候  将仓库中相关的数据清空
onBeforeUnmount(() => {
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
