<template>
  <div>
    <!-- 三级分类 -->
    <Cactgory :scene="scene"></Cactgory>
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- 展示已有spu数据 -->
        <el-table
          style="margin: 10px 0"
          border
          :data="records"
          max-height="480px"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column label="SPU名称" prop="spuName">
            <!-- 对spu的操作 -->
          </el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>
          <!--show-overflow-tooltip 超出部分隐藏  -->
          <el-table-column label="SPU操作">
            <template #="{ row, $index }">
              <!-- row即为已有的spu -->
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="primary"
                size="small"
                icon="View"
                title="查看spu列表"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定要删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row.id)"
              >
                <template #reference>
                  <el-button
                    type="primary"
                    size="small"
                    icon="Delete"
                    title="删除SPU"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNO"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout=" prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <!-- 添加或者修改 -->
      <SpuForm
        ref="spuForm"
        v-show="scene === 1"
        @changeScene="changeScene"
      ></SpuForm>
      <!-- 添加sku -->
      <SkuForm
        ref="skuForm"
        v-show="scene === 2"
        @changeScene="changeScene"
      ></SkuForm>
      <!-- 对话模态框 展示已有的sku属性 -->
      <el-dialog v-model="show" title="SKU列表">
        <el-table border :data="skuArr">
          <el-table-column label="SKU名字" prop="skuName"></el-table-column>
          <el-table-column label="SKU价格" prop="price"></el-table-column>
          <el-table-column label="SKU重量" prop="weight"></el-table-column>
          <el-table-column label="SKU图片">
            <template #="{ row, $index }">
              <img
                :src="row.skuDefaultImg"
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import SpuForm from "./SpuForm.vue";
import SkuForm from "./SkuForm.vue";
import { ref, watch, onBeforeUnmount } from "vue";
import {
  HasSouResponseData,
  Records,
  spuData,
  SkuData,
  SkuInfoDat,
} from "@/api/product/spu/type";
import { reqHasSpu, reqSkuList, reqRemoveSpu } from "@/api/product/spu/index";
//引入分了仓库
import useCategoryStore from "@/store/modules/category";
import { ElMessage } from "element-plus";
const categoryStore = useCategoryStore();

//分页器当前页码
let pageNO = ref<number>(0);
//每页展示几条数据
let pageSize = ref<number>(3);
//存储返回的已有spu数据
let records = ref<Records>([]);
//存储总条数
let total = ref<number>(0);
//场景切换变量
let scene = ref<number>(0);
//获取子组件实例
let spuForm = ref<any>();
let skuForm = ref<any>();
//定义查看列表
let skuArr = ref<SkuData[]>([]);
//控制模态框显示和隐藏
let show = ref<boolean>(false);

//封装请求方法
const getHasSpu = async (pager = 1) => {
  pageNO.value = pager;
  let res: HasSouResponseData = await reqHasSpu(
    pageNO.value,
    pageSize.value,
    categoryStore.c3Id
  );
  //    console.log(res);
  if (res.code === 200) {
    records.value = res.data.records;
    total.value = res.data.total;
  }
};

//添加spu方法
const addSpu = () => {
  //切换场景
  scene.value = 1;
  //调用子组件的添加方法  子组件没有三级id必须带过去
  spuForm.value.initAddSpu(categoryStore.c3Id);
};

//修改spu方法   row 已有的spu
const updateSpu = (row: spuData) => {
  scene.value = 1;
  // console.log(row);
  // console.log(spuForm.value);  获取子组件实例后 调用子组件方法
  spuForm.value.initHasSpuData(row);
};

//子组件自定义事件 切换场景
const changeScene = ({ flag, params }: any) => {
  console.log(flag, params);
  scene.value = flag;
  if (params === "update") {
    getHasSpu(pageNO.value);
  } else {
    getHasSpu();
  }
};

//添加sku方法
const addSku = (row: spuData) => {
  scene.value = 2;
  // console.log(row);
  skuForm.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row);
};

//删除已有spu回调
const deleteSpu = async (id: number | string) => {
  let res = await reqRemoveSpu(id);
  // console.log(res);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    //根据数组的长度来决定页码
    getHasSpu(records.value.length > 1 ? pageNO.value : pageNO.value - 1);
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
};

//查看sku列表数据
const findSku = async (row: spuData) => {
  let res = await reqSkuList(row.id as number);
  console.log(res);
  if (res.code === 200) {
    skuArr.value = res.data;
    //显示对话框
    show.value = true;
  }
};

//监听三级分类数据的变化
watch(
  () => categoryStore.c3Id,
  () => {
    //必须保证有三级分类id才能取发请求
    if (!categoryStore.c3Id) return;
    getHasSpu();
  }
);

//分页器每页展示条数改变   上面写的pager=1 是在这跳转到第一页用的
const changeSize = () => {
  getHasSpu();
};

onBeforeUnmount(() => {
  //当组件销毁的时候 清空仓库内的分了数据
  categoryStore.$reset();
});
</script>

<style lang="scss" scoped></style>
