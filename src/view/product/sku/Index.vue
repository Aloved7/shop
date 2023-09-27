<template>
  <el-card>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column
        label="名称"
        show-overflow-tooltip
        width="150px"
        prop="skuName"
      >
      </el-table-column>
      <el-table-column
        label="描述"
        show-overflow-tooltip
        width="150px"
        prop="skuDesc"
      >
      </el-table-column>
      <el-table-column label="图片" width="190px">
        <template #="{ row, $index }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column label="重量" width="190px" prop="price">
      </el-table-column>
      <el-table-column label="价格" width="190px" prop="weight">
      </el-table-column>
      <el-table-column label="操作" width="230px" fixed="right">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="upDataSale(row)"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="update"
          ></el-button>
          <el-button
            type="primary"
            size="small"
            icon="InfoFilled"
            @click="findSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`你确定要删除${row.skuName}吗`"
            width="200px"
            @confirm="removeSku(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="pageSize"
      :page-sizes="[4, 6, 8, 10]"
      :background="true"
      layout=" prev, pager, next, jumper,->,sizes,total,"
      :total="total"
      @current-change="getHasSku"
      @size-change="handleSize"
    />
    <!-- 抽屉组件 展示商品详情 -->
    <el-drawer v-model="drawer">
      <template #header>
        <h4>查看商品详情</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuInfo.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuInfo.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag
              v-for="(item, index) in skuInfo.skuAttrValueList"
              :key="item.id"
              style="margin: 5px"
              >{{ item.valueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">销售属性 </el-col>
          <el-col :span="18">
            <el-tag
              v-for="(item, index) in skuInfo.skuSaleAttrValueList"
              :key="item.id"
              style="margin: 5px"
              >{{ item.saleAttrName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0">
          <el-col :span="6">商品图片 </el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="200px">
              <el-carousel-item
                v-for="item in skuInfo.skuImageList"
                :key="item.id"
              >
                <img
                  :src="item.imgUrl"
                  alt=""
                  style="width: 100%; height: 100%"
                />
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </el-card>
</template>

<script setup lang="ts">
import { SkuResponseData, SkuData, SkuInfoData } from "@/api/product/sku/type";
import { ref, onMounted } from "vue";
import {
  reqSkuList,
  reqSaleSku,
  reqCancalSaleSku,
  reqSkuInfo,
  deleteSku,
} from "@/api/product/sku";
import { ElMessage } from "element-plus";
//分页器页码
let pageNo = ref<number>(1);
//每页展示几条数据
let pageSize = ref<number>(10);
let total = ref<number>(0);
//每一页展示的数 因为是根据请求获取的 就是页码和请求数
let skuArr = ref<SkuData[]>([]);
//控制抽屉组件的显示和隐藏
let drawer = ref<boolean>(false);
//收集返回数据 进行展示
let skuInfo = ref<any>({});

//组件挂载完毕 发送请求
onMounted(() => {
  getHasSku();
});
const getHasSku = async (pager = 1) => {
  pageNo.value = pager;
  let res: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value);
  if (res.code === 200) {
    total.value = res.data.total;
    skuArr.value = res.data.records;
  }
};

//页码改变触发  也可以行内触发
// const handleChange = (num: number) => {
//   //会自动注入当前页码
//   pageNo.value = num;
//   getHasSku(pageNo.value);
// };

//分页器下拉菜单发生变化时触发
const handleSize = () => {
  getHasSku();
  //因为 pageSize 会自动去修改 我们希望的是 当发生修改的时候跳转到第一页 所以不带参数 直接跳转到第一页
};

//商品上架与下架方法
const upDataSale = async (row: SkuData) => {
  if (row.isSale === 1) {
    //已下架 更新为上架
    let res = await reqCancalSaleSku(row.id as number);
    console.log(res);
    ElMessage({
      type: "success",
      message: "上架成功",
    });
    //发送请求刷新视图层
    getHasSku();
  } else {
    //已上架 更新为下架
    await reqSaleSku(row.id as number);
    // console.log(res);
    ElMessage({
      type: "success",
      message: "下架成功",
    });
    //发送请求刷新视图层
    getHasSku();
  }
};

//更新按钮方法
const update = () => {
  ElMessage({
    type: "info",
    message: "程序员载努力的开发中",
  });
};

//查看详情
const findSku = async (row: SkuData) => {
  drawer.value = true;
  //获取已有商品详情
  let res: SkuInfoData = await reqSkuInfo(row.id as number);
  //收集数据
  skuInfo.value = res.data;
};

//删除已有商品
const removeSku = async (id: number) => {
  let res = await deleteSku(id);
  if (res.code === 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }
  getHasSku(skuArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
};
</script>

<style lang="less" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
